/**
 * STREAM CONFIGURATION SSOT
 * Quản lý các mốc thời gian (Timings) và tham số luồng của vòng lặp phát TikTok Live.
 * Tách biệt hoàn toàn logic thời gian ra khỏi hook giao diện (Clean Code).
 */

export const STREAM_TIMING = {
  // Giai đoạn xuất phát & bước chân
  FOOTSTEP_AUDIO_DELAY_MS: 400,

  // Giai đoạn di chuyển -> Đứng suy nghĩ tại ô
  WALK_TO_THINKING_MS: 1800,

  // Giai đoạn đứng suy nghĩ -> Công bố kết quả (Reveal)
  THINKING_TO_REVEAL_MS: 3600,

  // Độ trễ hiệu ứng âm thanh phần thưởng khi công bố
  REWARD_SFX_DELAY_MS: 350,
  BUZZER_SFX_DELAY_MS: 700,

  // Thời gian hiển thị kết quả chúc mừng trước khi chuyển câu (Auto-Play)
  REVEAL_DISPLAY_MS: 3600,

  // Thời gian học sinh di chuyển từ ô về vạch xuất phát ban đầu
  RETURN_TO_SPAWN_MS: 1400,

  // Thời gian học sinh đứng đọc đề bài mới trước khi bắt đầu showdown tiếp theo
  READ_PROMPT_MS: 2800,

  // Độ trễ khởi động vòng lặp tự động khi mở ứng dụng lần đầu
  INITIAL_AUTOPLAY_DELAY_MS: 2500,

  // Độ trễ khi người dùng chuyển nhóm câu hỏi thủ công
  GROUP_SWITCH_DELAY_MS: 2200,

  // Độ trễ khi bật lại chế độ Auto-Play
  AUTOPLAY_RESTART_DELAY_MS: 1500,
} as const;
