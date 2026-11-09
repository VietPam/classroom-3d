import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { VRMLoaderPlugin, VRMUtils, type VRM } from '@pixiv/three-vrm';
import { VRMAnimationLoaderPlugin, type VRMAnimation } from '@pixiv/three-vrm-animation';

class VRMLoaderService {
  private loader: GLTFLoader;
  private animationCache: Map<string, VRMAnimation> = new Map();
  private pendingAnimationLoads: Map<string, Promise<VRMAnimation | null>> = new Map();

  constructor() {
    this.loader = new GLTFLoader();
    this.loader.register((parser) => new VRMLoaderPlugin(parser));
    this.loader.register((parser) => new VRMAnimationLoaderPlugin(parser));
  }

  /**
   * Tải mô hình .vrm độc lập cho học sinh
   */
  public async loadVRM(url: string): Promise<VRM | null> {
    try {
      const gltf = await this.loader.loadAsync(url);
      const vrm = gltf.userData.vrm as VRM | undefined;

      if (!vrm) {
        console.warn(`[VRMLoaderService] Không tìm thấy dữ liệu VRM trong file: ${url}`);
        return null;
      }

      // Tối ưu hóa layout hình học & gộp skeletons
      VRMUtils.removeUnnecessaryVertices(gltf.scene);
      VRMUtils.combineSkeletons(gltf.scene);

      // Chuẩn hóa góc quay mặc định nếu là model VRM0
      VRMUtils.rotateVRM0(vrm);

      return vrm;
    } catch (error) {
      console.warn(`[VRMLoaderService] Lỗi khi tải mô hình VRM (${url}):`, error);
      return null;
    }
  }

  /**
   * Tải hoạt ảnh .vrma (được cache để tái sử dụng cho mọi học sinh)
   */
  public async loadVRMA(url: string): Promise<VRMAnimation | null> {
    if (this.animationCache.has(url)) {
      return this.animationCache.get(url)!;
    }

    if (this.pendingAnimationLoads.has(url)) {
      return this.pendingAnimationLoads.get(url)!;
    }

    const loadPromise = (async () => {
      try {
        const gltf = await this.loader.loadAsync(url);
        const vrmAnimation = gltf.userData.vrmAnimation as VRMAnimation | undefined;

        if (vrmAnimation) {
          this.animationCache.set(url, vrmAnimation);
          return vrmAnimation;
        }

        console.warn(`[VRMLoaderService] Không tìm thấy vrmAnimation trong file: ${url}`);
        return null;
      } catch (error) {
        console.warn(`[VRMLoaderService] Không thể tải animation VRMA (${url}):`, error);
        return null;
      } finally {
        this.pendingAnimationLoads.delete(url);
      }
    })();

    this.pendingAnimationLoads.set(url, loadPromise);
    return loadPromise;
  }
}

export const vrmLoaderService = new VRMLoaderService();
