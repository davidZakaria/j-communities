# Recommended 3D Models for Home Hero

The home hero currently uses a photography-led approach with parallax effects for optimal performance and premium look. To enable a real 3D model in the future, the following models are recommended for evaluation:

## Top Recommendations

### 1. Modern Industrial Minimalist Residential Villa (Sketchfab)
- **URL**: https://sketchfab.com/3d-models/modern-industrial-minimalist-residential-villa-19bdf5998e284a7087dc1083aed35a93
- **Creator**: soysascha
- **Style**: High-quality modern villa with brick & black metal textures
- **Use case**: Arch viz and game development
- **Notes**: Check license on model page before commercial use; contact creator if needed

### 2. Mediterranean Villa (Meshy)
- **URL**: https://www.meshy.ai/3d-models/Mediterranean-Villa-019a6daa-b895-747a-9b22-f760e2912f31
- **License**: CC0 (Public Domain)
- **Style**: AI-generated Mediterranean villa
- **Format**: GLB available
- **Notes**: Free for commercial use, no attribution required

### 3. Glass Box Modern Villa (Meshy)
- **URL**: https://www.meshy.ai/3d-models/Glass-Box-Modern-Villa-019fb135-259c-7f7e-8823-138f9f20388b
- **License**: CC0 (Public Domain)
- **Style**: Contemporary modern villa with glass elements
- **Format**: GLB available
- **Notes**: Free for commercial use, no attribution required

### 4. Modern Villa 2021 (CGTrader)
- **URL**: https://www.cgtrader.com/3d-models/exterior/house/modern-villa-2021-blender-eevee-and-cycles-2-without-furniture
- **License**: Royalty Free (textures are CC0)
- **Style**: Premium modern villa, Los Angeles mansion inspired
- **Format**: GLB, FBX, OBJ (1.73 GB)
- **Notes**: High quality but large file size; may need optimization/LODs for web

## Alternative Sources

- **MorfVision** (https://morfvision.store/en/): CC0 furniture and architectural assets, WebGL-optimized
- **Poly Haven** (https://polyhaven.com/models): CC0 models, props-focused but high quality
- **Sketchfab Free Downloads**: Filter by license=cc0, downloadable=true, category=architecture

## Integration Notes

When adding a GLB model:

1. Place the file at `/client/public/assets/models/home/hero.glb`
2. Update `/client/src/config/projectModels.ts`:
   ```ts
   home: {
     glbUrl: "/assets/models/home/hero.glb",
     animationClips: ["Idle"], // or relevant clips
     cameraKeyframes: [...], // adjust for model scale
     useProceduralFallback: false, // IMPORTANT: set to false
   },
   ```
3. In `/client/src/components/Hero.tsx`, change `enableScene3D={false}` to `enableScene3D={true}`
4. Run `npm run compress:models` to optimize with Draco compression
5. Test on Chrome with DevTools Performance panel to ensure smooth 60fps

## Performance Guidelines

For web-ready models:
- **Polygon count**: Under 100k triangles preferred
- **Texture resolution**: 2K max (1K preferred for mobile)
- **File size**: Under 5MB compressed (Draco)
- **Materials**: Standard PBR, avoid complex shaders
