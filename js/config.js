export const gameModes = {
    "two-letter-words": {
        name: "2-Letter Words",
        description: "Given 7 random tiles, find as many 2 letter words as you can!",
        isListGame: true,
        requiresWordLookup: false,
    },
    "three-letter-words": {
        name: "3-Letter Words",
        description: "Given 7 random tiles, find as many 3 letter words as you can!",
        isListGame: true,
        requiresWordLookup: false,
    },
    "top-5000-7-letter-words": {
        name: "Top 5000 7-Letter Words",
        description: "Given 7 common tiles, find as many 7 letter bingos as you can!",
        isListGame: true,
        requiresWordLookup: true,
    },
    "top-5000-8-letter-words": {
        name: "Top 5000 8-Letter Words",
        description: "Given 8 common tiles, find as many 8 letter bingos as you can!",
        isListGame: true,
        requiresWordLookup: true,
    },
    "q-without-u-words": {
        name: "Q without U Words",
        description: "Practice words containing Q without a following U.",
        isListGame: false,
        requiresWordLookup: true,
    },
    "vowel-heavy-words": {
        name: "Vowel Heavy Words",
        description: "Practice words that are heavy on vowels.",
        isListGame: false,
        requiresWordLookup: true,
    },
    "jqxz-words-4-letter": {
        name: "JQXZ Words (4 letter)",
        description: "Practice four-letter words containing J, Q, X, or Z.",
        isListGame: false,
        requiresWordLookup: true,
    },
    "jqxz-words-5-letter": {
        name: "JQXZ Words (5 letter)",
        description: "Practice five-letter words containing J, Q, X, or Z.",
        isListGame: false,
        requiresWordLookup: true,
    },
    "words-without-vowels": {
        name: "Words Without Vowels",
        description: "Practice words that do not contain vowels.",
        isListGame: false,
        requiresWordLookup: true,
    },
    "500-more-useful-words": {
        name: "500+ More Useful Words",
        description: "Practice 500+ more useful words.",
        isListGame: false,
        requiresWordLookup: true,
    }
};
