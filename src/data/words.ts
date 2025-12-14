import { Word } from '../types';

export const wordsDatabase: Word[] = [
  // Long Vowels
  { id: 'w1', word: 'sheep', phoneme: '/i:/', phonemeGroup: 'long-vowels' },
  { id: 'w2', word: 'see', phoneme: '/i:/', phonemeGroup: 'long-vowels' },
  { id: 'w3', word: 'tree', phoneme: '/i:/', phonemeGroup: 'long-vowels' },
  { id: 'w4', word: 'car', phoneme: '/ɑ:/', phonemeGroup: 'long-vowels' },
  { id: 'w5', word: 'father', phoneme: '/ɑ:/', phonemeGroup: 'long-vowels' },
  { id: 'w6', word: 'law', phoneme: '/ɔ:/', phonemeGroup: 'long-vowels' },
  { id: 'w7', word: 'saw', phoneme: '/ɔ:/', phonemeGroup: 'long-vowels' },
  { id: 'w8', word: 'blue', phoneme: '/u:/', phonemeGroup: 'long-vowels' },
  { id: 'w9', word: 'food', phoneme: '/u:/', phonemeGroup: 'long-vowels' },
  { id: 'w10', word: 'bird', phoneme: '/ɜ:/', phonemeGroup: 'long-vowels' },
  { id: 'w11', word: 'herd', phoneme: '/ɜ:/', phonemeGroup: 'long-vowels' },
  
  // Short Vowels
  { id: 'w12', word: 'ship', phoneme: '/ɪ/', phonemeGroup: 'short-vowels' },
  { id: 'w13', word: 'bit', phoneme: '/ɪ/', phonemeGroup: 'short-vowels' },
  { id: 'w14', word: 'cat', phoneme: '/æ/', phonemeGroup: 'short-vowels' },
  { id: 'w15', word: 'hat', phoneme: '/æ/', phonemeGroup: 'short-vowels' },
  { id: 'w16', word: 'hot', phoneme: '/ɒ/', phonemeGroup: 'short-vowels' },
  { id: 'w17', word: 'pot', phoneme: '/ɒ/', phonemeGroup: 'short-vowels' },
  { id: 'w18', word: 'put', phoneme: '/ʊ/', phonemeGroup: 'short-vowels' },
  { id: 'w19', word: 'book', phoneme: '/ʊ/', phonemeGroup: 'short-vowels' },
  { id: 'w20', word: 'cup', phoneme: '/ʌ/', phonemeGroup: 'short-vowels' },
  { id: 'w21', word: 'luck', phoneme: '/ʌ/', phonemeGroup: 'short-vowels' },
  { id: 'w22', word: 'about', phoneme: '/ə/', phonemeGroup: 'short-vowels' },
  { id: 'w23', word: 'sofa', phoneme: '/ə/', phonemeGroup: 'short-vowels' },
  
  // Fricatives
  { id: 'w24', word: 'fish', phoneme: '/f/', phonemeGroup: 'fricatives' },
  { id: 'w25', word: 'fun', phoneme: '/f/', phonemeGroup: 'fricatives' },
  { id: 'w26', word: 'van', phoneme: '/v/', phonemeGroup: 'fricatives' },
  { id: 'w27', word: 'love', phoneme: '/v/', phonemeGroup: 'fricatives' },
  { id: 'w28', word: 'think', phoneme: '/θ/', phonemeGroup: 'fricatives' },
  { id: 'w29', word: 'bath', phoneme: '/θ/', phonemeGroup: 'fricatives' },
  { id: 'w30', word: 'this', phoneme: '/ð/', phonemeGroup: 'fricatives' },
  { id: 'w31', word: 'that', phoneme: '/ð/', phonemeGroup: 'fricatives' },
  { id: 'w32', word: 'sun', phoneme: '/s/', phonemeGroup: 'fricatives' },
  { id: 'w33', word: 'see', phoneme: '/s/', phonemeGroup: 'fricatives' },
  { id: 'w34', word: 'zoo', phoneme: '/z/', phonemeGroup: 'fricatives' },
  { id: 'w35', word: 'buzz', phoneme: '/z/', phonemeGroup: 'fricatives' },
  { id: 'w36', word: 'ship', phoneme: '/ʃ/', phonemeGroup: 'fricatives' },
  { id: 'w37', word: 'wish', phoneme: '/ʃ/', phonemeGroup: 'fricatives' },
  { id: 'w38', word: 'measure', phoneme: '/ʒ/', phonemeGroup: 'fricatives' },
  { id: 'w39', word: 'pleasure', phoneme: '/ʒ/', phonemeGroup: 'fricatives' },
  { id: 'w40', word: 'hat', phoneme: '/h/', phonemeGroup: 'fricatives' },
  { id: 'w41', word: 'house', phoneme: '/h/', phonemeGroup: 'fricatives' },
  
  // Plosives
  { id: 'w42', word: 'pen', phoneme: '/p/', phonemeGroup: 'plosives' },
  { id: 'w43', word: 'top', phoneme: '/p/', phonemeGroup: 'plosives' },
  { id: 'w44', word: 'bat', phoneme: '/b/', phonemeGroup: 'plosives' },
  { id: 'w45', word: 'rub', phoneme: '/b/', phonemeGroup: 'plosives' },
  { id: 'w46', word: 'top', phoneme: '/t/', phonemeGroup: 'plosives' },
  { id: 'w47', word: 'cat', phoneme: '/t/', phonemeGroup: 'plosives' },
  { id: 'w48', word: 'dog', phoneme: '/d/', phonemeGroup: 'plosives' },
  { id: 'w49', word: 'bed', phoneme: '/d/', phonemeGroup: 'plosives' },
  { id: 'w50', word: 'cat', phoneme: '/k/', phonemeGroup: 'plosives' },
  { id: 'w51', word: 'back', phoneme: '/k/', phonemeGroup: 'plosives' },
  { id: 'w52', word: 'go', phoneme: '/g/', phonemeGroup: 'plosives' },
  { id: 'w53', word: 'bag', phoneme: '/g/', phonemeGroup: 'plosives' },
  
  // Affricates
  { id: 'w54', word: 'chair', phoneme: '/tʃ/', phonemeGroup: 'affricates' },
  { id: 'w55', word: 'watch', phoneme: '/tʃ/', phonemeGroup: 'affricates' },
  { id: 'w56', word: 'joy', phoneme: '/dʒ/', phonemeGroup: 'affricates' },
  { id: 'w57', word: 'judge', phoneme: '/dʒ/', phonemeGroup: 'affricates' },
  
  // Nasals
  { id: 'w58', word: 'man', phoneme: '/m/', phonemeGroup: 'nasals' },
  { id: 'w59', word: 'sum', phoneme: '/m/', phonemeGroup: 'nasals' },
  { id: 'w60', word: 'no', phoneme: '/n/', phonemeGroup: 'nasals' },
  { id: 'w61', word: 'sun', phoneme: '/n/', phonemeGroup: 'nasals' },
  { id: 'w62', word: 'sing', phoneme: '/ŋ/', phonemeGroup: 'nasals' },
  { id: 'w63', word: 'ring', phoneme: '/ŋ/', phonemeGroup: 'nasals' },
  
  // Liquids & Glides
  { id: 'w64', word: 'let', phoneme: '/l/', phonemeGroup: 'liquids' },
  { id: 'w65', word: 'ball', phoneme: '/l/', phonemeGroup: 'liquids' },
  { id: 'w66', word: 'red', phoneme: '/r/', phonemeGroup: 'liquids' },
  { id: 'w67', word: 'car', phoneme: '/r/', phonemeGroup: 'liquids' },
  { id: 'w68', word: 'wet', phoneme: '/w/', phonemeGroup: 'liquids' },
  { id: 'w69', word: 'win', phoneme: '/w/', phonemeGroup: 'liquids' },
  { id: 'w70', word: 'yes', phoneme: '/j/', phonemeGroup: 'liquids' },
  { id: 'w71', word: 'you', phoneme: '/j/', phonemeGroup: 'liquids' },
];

export function getWordsByPhoneme(phoneme: string): Word[] {
  return wordsDatabase.filter(w => w.phoneme === phoneme);
}

export function getRandomWords(count: number = 10): Word[] {
  const shuffled = [...wordsDatabase].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

