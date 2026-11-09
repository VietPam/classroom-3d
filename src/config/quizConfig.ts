/**
 * VOCABULARY QUIZ CONFIGURATION SCRIPT
 * File cấu hình 3 nhóm câu hỏi từ vựng IELTS / Tiếng Anh giao tiếp TikTok Live:
 * 1. SYNONYMS (Từ đồng nghĩa thông dụng)
 * 2. ANTONYMS (Từ trái nghĩa cơ bản)
 * 3. FILL_BLANK (Điền từ vào câu / Giới từ & Collocations quen thuộc)
 * 
 * Hỗ trợ vòng lặp phát liên tục (Continuous Auto-Play Stream 24/7).
 */

export type QuizGroupId = 'synonyms' | 'antonyms' | 'fill_blank';

export interface QuizGroupInfo {
  id: QuizGroupId;
  name: string;
  badge: string;
  description: string;
  accentColor: string;
}

export const QUIZ_GROUPS: Record<QuizGroupId, QuizGroupInfo> = {
  synonyms: {
    id: 'synonyms',
    name: 'Từ Đồng Nghĩa',
    badge: 'SYNONYMS',
    description: 'Tìm từ có nghĩa tương đương',
    accentColor: '#F59E0B',
  },
  antonyms: {
    id: 'antonyms',
    name: 'Từ Trái Nghĩa',
    badge: 'ANTONYMS',
    description: 'Tìm từ có ý nghĩa đối lập',
    accentColor: '#3B82F6',
  },
  fill_blank: {
    id: 'fill_blank',
    name: 'Điền Từ Vào Câu',
    badge: 'FILL IN BLANK',
    description: 'Chọn giới từ / dạng từ chính xác',
    accentColor: '#10B981',
  },
};

export interface IELTSQuizOption {
  id: 'A' | 'B' | 'C' | 'D';
  word: string; // Từ vựng đáp án
  ipa: string; // Phiên âm chuẩn IPA
  meaning: string; // Nghĩa tiếng Việt ngắn gọn, dễ nhớ
  isCorrect?: boolean;
}

export interface IELTSQuizItem {
  id: string;
  groupId: QuizGroupId;
  groupName: string;
  category: string;
  level: string;
  question: string;
  targetWord: string;
  contextSentence?: string;
  options: IELTSQuizOption[];
  correctOption: 'A' | 'B' | 'C' | 'D';
}

export const IELTS_QUIZ_DECK: IELTSQuizItem[] = [
  // ==========================================
  // NHÓM 1: TỪ ĐỒNG NGHĨA (SYNONYMS)
  // ==========================================
  {
    id: 'syn-01',
    groupId: 'synonyms',
    groupName: 'Từ Đồng Nghĩa',
    category: 'Synonym Challenge',
    level: 'IELTS Band 6.0+',
    question: 'TỪ NÀO ĐỒNG NGHĨA VỚI:',
    targetWord: 'HUGE',
    contextSentence: '"That blue whale is really huge!"',
    options: [
      {
        id: 'A',
        word: 'enormous',
        ipa: '/ɪˈnɔː.məs/',
        meaning: 'khổng lồ, to lớn',
        isCorrect: true,
      },
      {
        id: 'B',
        word: 'tiny',
        ipa: '/ˈtaɪ.ni/',
        meaning: 'tí hon, bé xíu',
        isCorrect: false,
      },
      {
        id: 'C',
        word: 'weak',
        ipa: '/wiːk/',
        meaning: 'yếu ớt, mong manh',
        isCorrect: false,
      },
      {
        id: 'D',
        word: 'slow',
        ipa: '/sləʊ/',
        meaning: 'chậm chạp, từ tốn',
        isCorrect: false,
      },
    ],
    correctOption: 'A',
  },
  {
    id: 'syn-02',
    groupId: 'synonyms',
    groupName: 'Từ Đồng Nghĩa',
    category: 'Synonym Challenge',
    level: 'IELTS Band 6.0+',
    question: 'TỪ NÀO ĐỒNG NGHĨA VỚI:',
    targetWord: 'SMART',
    contextSentence: '"She is a very smart and creative student."',
    options: [
      {
        id: 'A',
        word: 'lazy',
        ipa: '/ˈleɪ.zi/',
        meaning: 'lười biếng, uể oải',
        isCorrect: false,
      },
      {
        id: 'B',
        word: 'clever',
        ipa: '/ˈklev.ər/',
        meaning: 'thông minh, khéo léo',
        isCorrect: true,
      },
      {
        id: 'C',
        word: 'clumsy',
        ipa: '/ˈklʌm.zi/',
        meaning: 'vụng về, lóng ngóng',
        isCorrect: false,
      },
      {
        id: 'D',
        word: 'boring',
        ipa: '/ˈbɔː.rɪŋ/',
        meaning: 'nhạt nhẽo, buồn chán',
        isCorrect: false,
      },
    ],
    correctOption: 'B',
  },
  {
    id: 'syn-03',
    groupId: 'synonyms',
    groupName: 'Từ Đồng Nghĩa',
    category: 'Synonym Challenge',
    level: 'IELTS Band 6.0+',
    question: 'TỪ NÀO ĐỒNG NGHĨA VỚI:',
    targetWord: 'TIRED',
    contextSentence: '"After running for an hour, he was tired."',
    options: [
      {
        id: 'A',
        word: 'excited',
        ipa: '/ɪkˈsaɪ.tɪd/',
        meaning: 'phấn khích, hào hứng',
        isCorrect: false,
      },
      {
        id: 'B',
        word: 'hungry',
        ipa: '/ˈhʌŋ.ɡri/',
        meaning: 'đói bụng, cồn cào',
        isCorrect: false,
      },
      {
        id: 'C',
        word: 'exhausted',
        ipa: '/ɪɡˈzɔː.stɪd/',
        meaning: 'kiệt sức, rã rời',
        isCorrect: true,
      },
      {
        id: 'D',
        word: 'angry',
        ipa: '/ˈæŋ.ɡri/',
        meaning: 'tức giận, cáu kỉnh',
        isCorrect: false,
      },
    ],
    correctOption: 'C',
  },
  {
    id: 'syn-04',
    groupId: 'synonyms',
    groupName: 'Từ Đồng Nghĩa',
    category: 'Synonym Challenge',
    level: 'IELTS Band 6.0+',
    question: 'TỪ NÀO ĐỒNG NGHĨA VỚI:',
    targetWord: 'ACCURATE',
    contextSentence: '"Make sure your answers are accurate."',
    options: [
      {
        id: 'A',
        word: 'correct',
        ipa: '/kəˈrekt/',
        meaning: 'chính xác, chuẩn xác',
        isCorrect: true,
      },
      {
        id: 'B',
        word: 'wrong',
        ipa: '/rɒŋ/',
        meaning: 'sai lệch, không đúng',
        isCorrect: false,
      },
      {
        id: 'C',
        word: 'noisy',
        ipa: '/ˈnɔɪ.zi/',
        meaning: 'ồn ào, huyên náo',
        isCorrect: false,
      },
      {
        id: 'D',
        word: 'simple',
        ipa: '/ˈsɪm.pəl/',
        meaning: 'đơn giản, dễ hiểu',
        isCorrect: false,
      },
    ],
    correctOption: 'A',
  },

  // ==========================================
  // NHÓM 2: TỪ TRÁI NGHĨA (ANTONYMS)
  // ==========================================
  {
    id: 'ant-01',
    groupId: 'antonyms',
    groupName: 'Từ Trái Nghĩa',
    category: 'Antonym Challenge',
    level: 'IELTS Band 6.0+',
    question: 'TỪ NÀO TRÁI NGHĨA VỚI:',
    targetWord: 'GENEROUS',
    contextSentence: '"He is generous, always helping people."',
    options: [
      {
        id: 'A',
        word: 'kind',
        ipa: '/kaɪnd/',
        meaning: 'tốt bụng, tử tế',
        isCorrect: false,
      },
      {
        id: 'B',
        word: 'selfish',
        ipa: '/ˈsel.fɪʃ/',
        meaning: 'ích kỷ, hẹp hòi',
        isCorrect: true,
      },
      {
        id: 'C',
        word: 'brave',
        ipa: '/breɪv/',
        meaning: 'dũng cảm, kiên cường',
        isCorrect: false,
      },
      {
        id: 'D',
        word: 'calm',
        ipa: '/kɑːm/',
        meaning: 'bình tĩnh, điềm đạm',
        isCorrect: false,
      },
    ],
    correctOption: 'B',
  },
  {
    id: 'ant-02',
    groupId: 'antonyms',
    groupName: 'Từ Trái Nghĩa',
    category: 'Antonym Challenge',
    level: 'IELTS Band 6.0+',
    question: 'TỪ NÀO TRÁI NGHĨA VỚI:',
    targetWord: 'ANCIENT',
    contextSentence: '"They discovered an ancient monument."',
    options: [
      {
        id: 'A',
        word: 'modern',
        ipa: '/ˈmɒd.ən/',
        meaning: 'hiện đại, tân tiến',
        isCorrect: true,
      },
      {
        id: 'B',
        word: 'old',
        ipa: '/əʊld/',
        meaning: 'cổ xưa, già cỗi',
        isCorrect: false,
      },
      {
        id: 'C',
        word: 'historic',
        ipa: '/hɪˈstɒr.ɪk/',
        meaning: 'thuộc lịch sử lâu đời',
        isCorrect: false,
      },
      {
        id: 'D',
        word: 'classic',
        ipa: '/ˈklæs.ɪk/',
        meaning: 'cổ điển, truyền thống',
        isCorrect: false,
      },
    ],
    correctOption: 'A',
  },
  {
    id: 'ant-03',
    groupId: 'antonyms',
    groupName: 'Từ Trái Nghĩa',
    category: 'Antonym Challenge',
    level: 'IELTS Band 6.0+',
    question: 'TỪ NÀO TRÁI NGHĨA VỚI:',
    targetWord: 'BRAVE',
    contextSentence: '"The brave rescuer jumped into the water."',
    options: [
      {
        id: 'A',
        word: 'heroic',
        ipa: '/hɪˈrəʊ.ɪk/',
        meaning: 'anh dũng, hào hiệp',
        isCorrect: false,
      },
      {
        id: 'B',
        word: 'bold',
        ipa: '/bəʊld/',
        meaning: 'táo bạo, quả quyết',
        isCorrect: false,
      },
      {
        id: 'C',
        word: 'cowardly',
        ipa: '/ˈkaʊ.əd.li/',
        meaning: 'hèn nhát, nhát gan',
        isCorrect: true,
      },
      {
        id: 'D',
        word: 'strong',
        ipa: '/strɒŋ/',
        meaning: 'mạnh mẽ, kiên cố',
        isCorrect: false,
      },
    ],
    correctOption: 'C',
  },
  {
    id: 'ant-04',
    groupId: 'antonyms',
    groupName: 'Từ Trái Nghĩa',
    category: 'Antonym Challenge',
    level: 'IELTS Band 6.0+',
    question: 'TỪ NÀO TRÁI NGHĨA VỚI:',
    targetWord: 'RARE',
    contextSentence: '"This is a very rare species of bird."',
    options: [
      {
        id: 'A',
        word: 'common',
        ipa: '/ˈkɒm.ən/',
        meaning: 'phổ biến, thông dụng',
        isCorrect: true,
      },
      {
        id: 'B',
        word: 'unique',
        ipa: '/juːˈniːk/',
        meaning: 'độc nhất, hiếm thấy',
        isCorrect: false,
      },
      {
        id: 'C',
        word: 'precious',
        ipa: '/ˈpreʃ.əs/',
        meaning: 'quý hiếm, giá trị',
        isCorrect: false,
      },
      {
        id: 'D',
        word: 'scarce',
        ipa: '/skeəs/',
        meaning: 'khan hiếm, ít ỏi',
        isCorrect: false,
      },
    ],
    correctOption: 'A',
  },

  // ==========================================
  // NHÓM 3: ĐIỀN TỪ VÀO CÂU (FILL IN THE BLANK)
  // ==========================================
  {
    id: 'fill-01',
    groupId: 'fill_blank',
    groupName: 'Điền Từ Vào Câu',
    category: 'Grammar & Context',
    level: 'Essential English',
    question: 'CHỌN GIỚI TỪ THÍCH HỢP:',
    targetWord: 'IN THE MORNING',
    contextSentence: '"She always drinks warm tea ____ the morning."',
    options: [
      {
        id: 'A',
        word: 'in',
        ipa: '/ɪn/',
        meaning: 'vào (buổi sáng/chiều)',
        isCorrect: true,
      },
      {
        id: 'B',
        word: 'at',
        ipa: '/æt/',
        meaning: 'tại, vào lúc (giờ cụ thể)',
        isCorrect: false,
      },
      {
        id: 'C',
        word: 'on',
        ipa: '/ɒn/',
        meaning: 'vào (thứ trong tuần, ngày)',
        isCorrect: false,
      },
      {
        id: 'D',
        word: 'by',
        ipa: '/baɪ/',
        meaning: 'trước, cạnh bên',
        isCorrect: false,
      },
    ],
    correctOption: 'A',
  },
  {
    id: 'fill-02',
    groupId: 'fill_blank',
    groupName: 'Điền Từ Vào Câu',
    category: 'Collocation Challenge',
    level: 'IELTS Band 6.0+',
    question: 'CHỌN DẠNG ĐÚNG CHO CÂU:',
    targetWord: 'LOOK FORWARD TO + V-ING',
    contextSentence: '"I am looking forward to ____ Tokyo soon."',
    options: [
      {
        id: 'A',
        word: 'visit',
        ipa: '/ˈvɪz.ɪt/',
        meaning: 'thăm quan (nguyên mẫu)',
        isCorrect: false,
      },
      {
        id: 'B',
        word: 'visited',
        ipa: '/ˈvɪz.ɪ.tɪd/',
        meaning: 'đã thăm (quá khứ)',
        isCorrect: false,
      },
      {
        id: 'C',
        word: 'visiting',
        ipa: '/ˈvɪz.ɪ.tɪŋ/',
        meaning: 'thăm quan (V-ing sau to)',
        isCorrect: true,
      },
      {
        id: 'D',
        word: 'visits',
        ipa: '/ˈvɪz.ɪts/',
        meaning: 'thăm (ngôi thứ ba)',
        isCorrect: false,
      },
    ],
    correctOption: 'C',
  },
  {
    id: 'fill-03',
    groupId: 'fill_blank',
    groupName: 'Điền Từ Vào Câu',
    category: 'Preposition Challenge',
    level: 'Essential English',
    question: 'CHỌN GIỚI TỪ ĐI KÈM ĐÚNG:',
    targetWord: 'INTERESTED IN',
    contextSentence: '"Are you interested ____ learning foreign languages?"',
    options: [
      {
        id: 'A',
        word: 'with',
        ipa: '/wɪð/',
        meaning: 'cùng với, đi kèm',
        isCorrect: false,
      },
      {
        id: 'B',
        word: 'about',
        ipa: '/əˈbaʊt/',
        meaning: 'về điều gì',
        isCorrect: false,
      },
      {
        id: 'C',
        word: 'for',
        ipa: '/fɔːr/',
        meaning: 'dành cho, vì',
        isCorrect: false,
      },
      {
        id: 'D',
        word: 'in',
        ipa: '/ɪn/',
        meaning: 'quan tâm, say mê (interested in)',
        isCorrect: true,
      },
    ],
    correctOption: 'D',
  },
  {
    id: 'fill-04',
    groupId: 'fill_blank',
    groupName: 'Điền Từ Vào Câu',
    category: 'Grammar Challenge',
    level: 'IELTS Band 6.0+',
    question: 'CHỌN DẠNG ĐỘNG TỪ ĐÚNG:',
    targetWord: 'AVOID + V-ING',
    contextSentence: '"You should avoid ____ junk food late at night."',
    options: [
      {
        id: 'A',
        word: 'eat',
        ipa: '/iːt/',
        meaning: 'ăn (động từ nguyên mẫu)',
        isCorrect: false,
      },
      {
        id: 'B',
        word: 'eating',
        ipa: '/ˈiː.tɪŋ/',
        meaning: 'ăn (V-ing sau avoid)',
        isCorrect: true,
      },
      {
        id: 'C',
        word: 'to eat',
        ipa: '/tuː iːt/',
        meaning: 'để ăn (to-V)',
        isCorrect: false,
      },
      {
        id: 'D',
        word: 'ate',
        ipa: '/eɪt/',
        meaning: 'đã ăn (quá khứ)',
        isCorrect: false,
      },
    ],
    correctOption: 'B',
  },
];

/**
 * Trả về danh sách câu hỏi theo bộ lọc nhóm (Synonyms / Antonyms / Fill Blank / Tất cả)
 */
export function getQuizPlaylist(groupId?: string): IELTSQuizItem[] {
  if (!groupId || groupId === 'all') {
    return IELTS_QUIZ_DECK;
  }
  return IELTS_QUIZ_DECK.filter((item) => item.groupId === groupId);
}

/**
 * Lấy câu hỏi theo chỉ mục an toàn
 */
export function getQuizByIndex(index: number, groupId?: string): IELTSQuizItem {
  const playlist = getQuizPlaylist(groupId);
  if (playlist.length === 0) return IELTS_QUIZ_DECK[0];
  const safeIndex = ((index % playlist.length) + playlist.length) % playlist.length;
  return playlist[safeIndex];
}

/**
 * Đếm tổng số câu hỏi theo nhóm
 */
export function getTotalQuizCount(groupId?: string): number {
  return getQuizPlaylist(groupId).length;
}

export const ACTIVE_QUIZ_INDEX = 0;

export function getActiveQuiz(index = ACTIVE_QUIZ_INDEX): IELTSQuizItem {
  return getQuizByIndex(index);
}
