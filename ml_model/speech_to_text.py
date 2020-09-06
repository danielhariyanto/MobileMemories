from google.cloud import speech_v1, storage
import io
from scipy.io import wavfile
import math
import numpy as np
import cloudstorage as gcs
import pitch

def sample_long_running_recognize(audio_file, printTranscript=False, printMetrics=False):
    """
    Print start and end time of each word spoken in audio file from Cloud Storage

    Args:
      audio_file URI for audio file in Cloud Storage, e.g. gs://[BUCKET]/[FILE]
    """
    metrics = {}

    client = speech_v1.SpeechClient()

    BUCKET = 'mobile_memory'
    google_client = storage.Client()
    bucket = google_client.get_bucket(BUCKET)

    file_name = 'English/Kempler/0wav/d10.wav'

    blob = bucket.blob(file_name)
    file_as_string = blob.download_as_string()
    sampleRate, audio_data = wavfile.read(io.BytesIO(file_as_string))

    language_code = "en-US"
    config = {
        "enable_word_time_offsets": True,
        "language_code": language_code,
    }
    # "enable_speaker_diarization": enable_speaker_diarization,
    # "diarization_speaker_count": diarization_speaker_count,

    audio = {"uri": audio_file}
    operation = client.long_running_recognize(config, audio)

    print(u"Waiting for operation to complete...")
    response = operation.result()

    if printTranscript:
        for result in response.results:
            print(u"Transcript: {}".format(result.alternatives[0].transcript))

        input("\nPress to view time stamps")

    pause_start_time = 0.

    sum1_pause = sum1_speech = sum1_pitch = sum1_rmsE = 0.
    sum2_pause = sum2_speech = sum2_pitch = sum2_rmsE = 0.
    word_count = 0.
    pause_count = 0.
    # a pause is counted when there is at least 2s without a word detected

    TLT = 0. # total locution time (speech time including pauses)
    TPT = 0. # total locution time (speech time without pauses)

    # calculating metrics...
    for result in response.results:
        if printTranscript:
            print("="*30)
        for word in result.alternatives[0].words:
            word_start_time = word.start_time.seconds + word.start_time.nanos/1e9
            word_end_time = word.end_time.seconds + word.end_time.nanos/1e9

            if printTranscript:
                print(u"{}: {}-{}".format(word.word, word_start_time, word_end_time))

            pause_length = word_start_time - pause_start_time
            if pause_length > 2:
                sum1_pause += pause_length
                sum2_pause += pause_length ** 2

                pause_count += 1.

            speech_length = word_end_time - word_start_time
            sum1_speech += speech_length
            sum2_speech += speech_length ** 2

            word_count += 1.

            TLT += word_end_time - pause_start_time
            TPT += word_end_time - word_start_time

            if word_end_time - word_start_time > 0.01:
                cut = audio_data[int(word_start_time*sampleRate):
                                    int(word_end_time*sampleRate)]

                rmsE = np.sqrt(np.mean(np.square(cut)))
                sum1_rmsE += speech_length
                sum2_rmsE += speech_length ** 2

                wavfile.write("cut_word.wav", sampleRate, cut)
                p = pitch.find_pitch("./cut_word.wav")
                sum1_pitch += p
                sum2_pitch += p ** 2

            pause_start_time = word_end_time

    metrics["mean pause"] = sum1_pause / pause_count
    metrics["var pause"] = (pause_count * sum2_pause - sum1_pause ** 2) / (pause_count ** 2)

    metrics["mean speech"] = sum1_speech / word_count
    metrics["var speech"] = (word_count * sum2_speech - sum1_speech ** 2) / (word_count ** 2)

    metrics["mean pitch"] = sum1_pitch / word_count
    metrics["var pitch"] = (word_count * sum2_pitch - sum1_pitch ** 2) / (word_count ** 2)

    metrics["mean rms energy"] = sum1_rmsE / word_count
    metrics["var rms energy"] = (word_count * sum2_rmsE - sum1_rmsE ** 2) / (word_count ** 2)

    metrics["verbal rate"] = word_count / TLT
    metrics["transformed phonation rate"] = math.asin(math.sqrt(TPT / TLT))
    metrics["standardized phonation time"] = word_count / TPT
    metrics["standardized pause rate"] = word_count / pause_count

    if printMetrics:
        for title,value in metrics.items():
            print(f"{title}: {value}")

    return metrics

def main():
    audio_file = "gs://mobile_memory/English/Kempler/0wav/d10.wav"
    sample_long_running_recognize(audio_file, printMetrics=True)

if __name__ == '__main__':
    main()
