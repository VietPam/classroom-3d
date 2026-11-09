/**
 * CHARACTER CONFIGURATION SSOT
 * Quản lý cấu hình động cơ nhân vật (Engine Type) và đường dẫn tài nguyên VRM / VRMA.
 */

export type CharacterEngineType = 'procedural' | 'vrm';

export interface CharacterConfig {
  /**
   * Động cơ hiển thị nhân vật đang kích hoạt:
   * - 'procedural': Dùng khối hình học Chibi thủ công (0 KB download, an toàn tuyệt đối)
   * - 'vrm': Dùng mô hình VRM 1.0 (VRoid Studio) kết hợp animation VRMA chuẩn Mixamo
   */
  engineType: CharacterEngineType;

  /**
   * Đường dẫn file mô hình .vrm cho từng học sinh
   */
  vrmModelMap: Record<string, string>;

  /**
   * Danh sách 5 file hoạt ảnh VRMA (.vrma) dùng chung cho toàn bộ học sinh
   */
  vrmaAnimationMap: {
    IDLE: string;
    WALKING: string;
    THINKING: string;
    CELEBRATING: string;
    SAD: string;
  };
}

export const CHARACTER_CONFIG: CharacterConfig = {
  // Thay đổi sang 'vrm' để kích hoạt module VRM (có cơ chế auto-fallback nếu chưa có file)
  engineType: 'procedural',

  vrmModelMap: {
    s1: '/avatars/vrm/s1_binhan.vrm',
    s2: '/avatars/vrm/s2_camtu.vrm',
    s3: '/avatars/vrm/s3_dangkhoa.vrm',
    s4: '/avatars/vrm/s4_khanhlinh.vrm',
  },

  vrmaAnimationMap: {
    IDLE: '/animations/vrma/idle.vrma',
    WALKING: '/animations/vrma/walking.vrma',
    THINKING: '/animations/vrma/thinking.vrma',
    CELEBRATING: '/animations/vrma/celebrating.vrma',
    SAD: '/animations/vrma/sad.vrma',
  },
};
