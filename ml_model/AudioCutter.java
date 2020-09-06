import java.io.*;
import java.util.Scanner;
import javax.sound.sampled.*;

public class AudioCutter {
	public static String name = "depaul1a";
	public static String iterations = "16";
	public static String originalAudio = name+".wav";
	public static String script = name+".cha";
	public static String dementia = "dementia"+iterations+"-%d.wav";
	public static String control = "control"+iterations+"-%d.wav";
	
	
    public static void main(String[] args) throws FileNotFoundException{
    	
    	File myObj = new File(script);
		Scanner myReader = new Scanner(myObj);
		
		String file = "";
		
		while (myReader.hasNext()) {
			file += myReader.next()+" ";
		}
		
		String[] words = file.split(" ");
		
		int count = 0;
		for (int i = 0; i < words.length; i++) {
			if (words[i].equals("*INV:")) {
				boolean cont = true;
				int a = i+1;
				while (cont) {
					if (words[a].contains("_") && !words[a].matches(".*[a-zA-Z]+.*")) {
						String times[] = words[a].split("_");
						float startSecond = Float.parseFloat(times[0]);
						float endSecond = Float.parseFloat(times[1]);
						cutAudio(originalAudio,"/Users/danielhariyanto/eclipse-workspace/MedHacksData/control/"+String.format(control,count),startSecond,endSecond);
						cont = false;
						count++;
					}
					a++;
				}
			} else if (words[i].equals("*PAR:")) {
				boolean cont2 = true;
				int b = i+1;
				while (cont2) {
					if (words[b].contains("_") && !words[b].matches(".*[a-zA-Z]+.*")) {
						String times[] = words[b].split("_");
						float startSecond = Float.parseFloat(times[0]);
						float endSecond = Float.parseFloat(times[1]);
						cutAudio(originalAudio,"/Users/danielhariyanto/eclipse-workspace/MedHacksData/dementia/"+String.format(dementia,count),startSecond,endSecond);
						cont2 = false;
						count++;
					}
					b++;
				}
			}			
	    }
		myReader.close();
    }
    

    public static void cutAudio(String sourceFileName, String destinationFileName, float startSecond, float endSecond) {
		AudioInputStream inputStream = null;
		AudioInputStream shortenedStream = null;
		startSecond = startSecond/1000;
		endSecond = endSecond/1000;
		float secondsToCopy = endSecond - startSecond;
		try {
			File file = new File(sourceFileName);
			AudioFileFormat fileFormat = AudioSystem.getAudioFileFormat(file);
			AudioFormat format = fileFormat.getFormat();
			inputStream = AudioSystem.getAudioInputStream(file);
			int bytesPerSecond = format.getFrameSize() * (int)format.getFrameRate();
			inputStream.skip((int)(startSecond * bytesPerSecond));
			long framesOfAudioToCopy = (int)(secondsToCopy * (int)format.getFrameRate());
			shortenedStream = new AudioInputStream(inputStream, format, framesOfAudioToCopy);
			File destinationFile = new File(destinationFileName);
			AudioSystem.write(shortenedStream, fileFormat.getType(), destinationFile);
		} catch (Exception e) {
			System.out.println(e);
		} finally {
			if (inputStream != null) try { inputStream.close(); } catch (Exception e) { System.out.println(e); }
			if (shortenedStream != null) try { shortenedStream.close(); } catch (Exception e) { System.out.println(e); }
			}
		}
}
