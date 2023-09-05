import { defineConfig, presetUno, presetWebFonts } from "unocss";
import transformerVariantGroup from "@unocss/transformer-variant-group";

export default defineConfig({
  transformers: [transformerVariantGroup()],
  presets: [
    presetUno(),
    presetWebFonts({
      fonts: {
        sans: [
          {
            name: "Lato",
            weights: ["200", "300", "400", "500", "600", "700", "800"],
          },
        ],
      },
    }),
  ],
});
