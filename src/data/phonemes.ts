import { PhonemeGroup } from '../types';

export const phonemeGroups: PhonemeGroup[] = [
  {
    id: 'long-vowels',
    name: 'Long Vowels',
    phonemes: [
      { symbol: '/i:/', name: 'Long I', description: 'as in "sheep", "see"' },
      { symbol: '/ɑ:/', name: 'Long A', description: 'as in "car", "father"' },
      { symbol: '/ɔ:/', name: 'Long O', description: 'as in "law", "saw"' },
      { symbol: '/u:/', name: 'Long U', description: 'as in "blue", "food"' },
      { symbol: '/ɜ:/', name: 'Long ER', description: 'as in "bird", "herd"' },
    ],
  },
  {
    id: 'short-vowels',
    name: 'Short Vowels',
    phonemes: [
      { symbol: '/ɪ/', name: 'Short I', description: 'as in "ship", "bit"' },
      { symbol: '/æ/', name: 'Short A', description: 'as in "cat", "hat"' },
      { symbol: '/ɒ/', name: 'Short O', description: 'as in "hot", "pot"' },
      { symbol: '/ʊ/', name: 'Short U', description: 'as in "put", "book"' },
      { symbol: '/ʌ/', name: 'Short UH', description: 'as in "cup", "luck"' },
      { symbol: '/ə/', name: 'Schwa', description: 'as in "about", "sofa"' },
    ],
  },
  {
    id: 'fricatives',
    name: 'Fricatives',
    phonemes: [
      { symbol: '/f/', name: 'F', description: 'as in "fish", "fun"' },
      { symbol: '/v/', name: 'V', description: 'as in "van", "love"' },
      { symbol: '/θ/', name: 'TH (voiceless)', description: 'as in "think", "bath"' },
      { symbol: '/ð/', name: 'TH (voiced)', description: 'as in "this", "that"' },
      { symbol: '/s/', name: 'S', description: 'as in "sun", "see"' },
      { symbol: '/z/', name: 'Z', description: 'as in "zoo", "buzz"' },
      { symbol: '/ʃ/', name: 'SH', description: 'as in "ship", "wish"' },
      { symbol: '/ʒ/', name: 'ZH', description: 'as in "measure", "pleasure"' },
      { symbol: '/h/', name: 'H', description: 'as in "hat", "house"' },
    ],
  },
  {
    id: 'plosives',
    name: 'Plosives',
    phonemes: [
      { symbol: '/p/', name: 'P', description: 'as in "pen", "top"' },
      { symbol: '/b/', name: 'B', description: 'as in "bat", "rub"' },
      { symbol: '/t/', name: 'T', description: 'as in "top", "cat"' },
      { symbol: '/d/', name: 'D', description: 'as in "dog", "bed"' },
      { symbol: '/k/', name: 'K', description: 'as in "cat", "back"' },
      { symbol: '/g/', name: 'G', description: 'as in "go", "bag"' },
    ],
  },
  {
    id: 'affricates',
    name: 'Affricates',
    phonemes: [
      { symbol: '/tʃ/', name: 'CH', description: 'as in "chair", "watch"' },
      { symbol: '/dʒ/', name: 'J', description: 'as in "joy", "judge"' },
    ],
  },
  {
    id: 'nasals',
    name: 'Nasals',
    phonemes: [
      { symbol: '/m/', name: 'M', description: 'as in "man", "sum"' },
      { symbol: '/n/', name: 'N', description: 'as in "no", "sun"' },
      { symbol: '/ŋ/', name: 'NG', description: 'as in "sing", "ring"' },
    ],
  },
  {
    id: 'liquids',
    name: 'Liquids & Glides',
    phonemes: [
      { symbol: '/l/', name: 'L', description: 'as in "let", "ball"' },
      { symbol: '/r/', name: 'R', description: 'as in "red", "car"' },
      { symbol: '/w/', name: 'W', description: 'as in "wet", "win"' },
      { symbol: '/j/', name: 'Y', description: 'as in "yes", "you"' },
    ],
  },
];

