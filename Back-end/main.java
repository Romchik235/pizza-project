package main
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

/**
 * C3 = 2, String;
 * C13 = 8: Відсортувати слова заданого тексту за зростанням кількості в них заданої літери.
 */

public class StringSorter {
    public static void main(java.lang.String[] args) {
        java.lang.String text = "Відсортування слів з заданою буквою вввв за зростанням кількості в них цієї букви";
        char letterToSortBy = 'в';

        List<java.lang.String> words = extractWordsWithLetter(text, letterToSortBy);

        Collections.sort(words, Comparator.comparingInt(word -> countLetterOccurrences(word, letterToSortBy)));

        for (java.lang.String word : words) {
            System.out.println(word);
        }
    }

    private static List<java.lang.String> extractWordsWithLetter(java.lang.String text, char letter) {
        List<java.lang.String> words = new ArrayList<>();
        java.lang.String[] tokens = text.split("\\s+");

        for (java.lang.String token : tokens) {
            if (containsLetter(token, letter)) {
                words.add(token);
            }
        }

        return words;
    }

    private static boolean containsLetter(java.lang.String word, char letter) {
        return word.toLowerCase().contains(java.lang.String.valueOf(Character.toLowerCase(letter)));
    }

    private static int countLetterOccurrences(java.lang.String word, char letter) {
        int count = 0;
        for (char c : word.toCharArray()) {
            if (Character.toLowerCase(c) == Character.toLowerCase(letter)) {
                count++;
            }
        }
        return count;

    }
}
