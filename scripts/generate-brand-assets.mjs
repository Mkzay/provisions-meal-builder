import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { ImageResponse } = require("next/og");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, "../public");
const iconsDir = path.join(publicDir, "icons");
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

const box = (style, children) => ({ type: "div", props: { style: { display: "flex", ...style }, children } });

function createLogo(size = 100, shadow = true) {
  const r = Math.round(size * 0.24);
  const bw = Math.max(2, Math.round(size * 0.045));
  const s = shadow ? `${Math.max(2, Math.round(size * 0.05))}px ${Math.max(2, Math.round(size * 0.05))}px 0px #1C1917` : "none";
  const dim = Math.round(size * 0.82);

  return box(
    { width: size, height: size, borderRadius: r, backgroundColor: "#FDE68A", border: `${bw}px solid #1C1917`, boxShadow: s, alignItems: "center", justifyContent: "center" },
    [
      {
        type: "svg",
        props: {
          viewBox: "0 0 48 48",
          width: dim,
          height: dim,
          fill: "none",
          children: [
            { type: "circle", props: { cx: "24", cy: "24", r: "18", fill: "#FEF9C3", opacity: "0.7" } },
            { type: "path", props: { fillRule: "evenodd", clipRule: "evenodd", d: "M10 11C10 8.79086 11.7909 7 14 7H26C32.0751 7 37 11.9249 37 18C37 24.0751 32.0751 29 26 29H17.5V38C17.5 40.2091 15.7091 42 13.5 42H13C11.3431 42 10 40.6569 10 39V11ZM17.5 13.5V22.5H25.5C27.9853 22.5 30 20.4853 30 18C30 15.5147 27.9853 13.5 25.5 13.5H17.5Z", fill: "#1C1917" } },
            { type: "path", props: { d: "M21 21C21 16 25 13.5 29 13.5C29 17.5 26.5 21 21 21Z", fill: "#10B981", stroke: "#1C1917", strokeWidth: "1.5", strokeLinejoin: "round" } },
            { type: "path", props: { d: "M22 19C20 16.5 19 14.5 20.5 12.5C22.8 12.5 24 15.5 22 19Z", fill: "#6EE7B7", stroke: "#1C1917", strokeWidth: "1.2", strokeLinejoin: "round" } },
            { type: "path", props: { d: "M22 20.5C24 18 26.5 16 28 14.5", stroke: "#065F46", strokeWidth: "1", strokeLinecap: "round" } },
            { type: "path", props: { d: "M38 8L39 11L42 12L39 13L38 16L37 13L34 12L37 11L38 8Z", fill: "#F59E0B", stroke: "#1C1917", strokeWidth: "0.8" } },
          ],
        },
      },
    ]
  );
}

function createOg() {
  const chip = (bg, text) => box({ backgroundColor: bg, border: "2px solid #1C1917", boxShadow: "2.5px 2.5px 0px #1C1917", borderRadius: "8px", padding: "6px 14px", fontSize: "14px", fontWeight: 700, color: "#1C1917" }, text);
  const card = (bg, rot, text) => box({ backgroundColor: bg, border: "3px solid #1C1917", boxShadow: "6px 6px 0px #1C1917", borderRadius: "16px", padding: "18px 24px", fontSize: "19px", fontWeight: 800, color: "#1C1917", transform: `rotate(${rot}deg)`, alignItems: "center" }, text);

  return box(
    { width: "100%", height: "100%", backgroundColor: "#FAF8F5", alignItems: "center", justifyContent: "center", padding: "40px", fontFamily: "system-ui, sans-serif" },
    [
      box(
        { width: "100%", height: "100%", backgroundColor: "#FFFFFF", borderRadius: "28px", border: "4px solid #1C1917", boxShadow: "12px 12px 0px #1C1917", flexDirection: "column", justifyContent: "space-between", padding: "48px 56px" },
        [
          // Header
          box({ alignItems: "center", justifyContent: "space-between", width: "100%" }, [
            box({ backgroundColor: "#FDE68A", border: "2px solid #1C1917", boxShadow: "3px 3px 0px #1C1917", borderRadius: "10px", padding: "6px 16px", fontSize: "15px", fontWeight: 800, color: "#1C1917", letterSpacing: "0.08em" }, "KITCHEN DECIDER & MEAL SANCTUARY"),
            box({ backgroundColor: "#D1FAE5", border: "2px solid #1C1917", boxShadow: "3px 3px 0px #1C1917", borderRadius: "9999px", padding: "6px 18px", fontSize: "14px", fontWeight: 800, color: "#065F46", alignItems: "center", gap: "8px" }, [
              box({ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#10B981" }),
              "ZERO MEAL FATIGUE",
            ]),
          ]),

          // Body
          box({ alignItems: "center", justifyContent: "space-between", width: "100%", gap: "40px" }, [
            // Left Col
            box({ flexDirection: "column", maxWidth: "600px" }, [
              box({ alignItems: "center", gap: "22px", marginBottom: "16px" }, [
                createLogo(100, true),
                box({ flexDirection: "column" }, [
                  box({ fontSize: "56px", fontWeight: 900, color: "#1C1917", lineHeight: 1, letterSpacing: "-0.03em" }, "Provisions"),
                  box({ fontSize: "20px", fontWeight: 700, color: "#059669", marginTop: "6px" }, "Zero-Friction Pantry Decider"),
                ]),
              ]),
              box({ fontSize: "21px", color: "#57534E", lineHeight: 1.45, fontWeight: 500, marginBottom: "22px" }, "Gentle, low-effort pantry pairings and ready-meal suggestions to overcome daily meal fatigue."),
              box({ gap: "12px", flexWrap: "wrap" }, [
                chip("#FEF9C3", "✨ Low Mental Wall"),
                chip("#E0E7FF", "🥑 Pantry Matching"),
                chip("#FFEDD5", "⚡ 1-Tap Ready Meals"),
              ]),
            ]),

            // Right Col
            box({ flexDirection: "column", gap: "16px", width: "360px" }, [
              card("#FEF08A", -2.5, "🍳 What to eat right now?"),
              card("#BAE6FD", 2, "🥣 3 Ingredients or Less"),
              card("#BBF7D0", -1.5, "⏱️ Instant Decision Routine"),
            ]),
          ]),

          // Footer
          box({ alignItems: "center", justifyContent: "space-between", borderTop: "2px dashed #E7E5E4", paddingTop: "18px", width: "100%" }, [
            box({ fontSize: "16px", fontWeight: 700, color: "#78716C", letterSpacing: "0.04em" }, "provisions-meal-builder.vercel.app"),
            box({ fontSize: "15px", fontWeight: 700, color: "#1C1917" }, "Comfort First | Low Friction | 100% Real Meals"),
          ]),
        ]
      ),
    ]
  );
}

function pngToIco(png) {
  const h = Buffer.alloc(6);
  h.writeUInt16LE(1, 2);
  h.writeUInt16LE(1, 4);
  const e = Buffer.alloc(16);
  e.writeUInt8(32, 0);
  e.writeUInt8(32, 1);
  e.writeUInt16LE(1, 4);
  e.writeUInt16LE(32, 6);
  e.writeUInt32LE(png.length, 8);
  e.writeUInt32LE(22, 12);
  return Buffer.concat([h, e, png]);
}

async function run() {
  console.log("🎨 Generating Provisions brand assets...");
  const ogRes = new ImageResponse(createOg(), { width: 1200, height: 630 });
  fs.writeFileSync(path.join(publicDir, "og-image.png"), Buffer.from(await ogRes.arrayBuffer()));

  const appleRes = new ImageResponse(box({ width: "100%", height: "100%", alignItems: "center", justifyContent: "center", backgroundColor: "#FAF8F5" }, [createLogo(144, false)]), { width: 180, height: 180 });
  fs.writeFileSync(path.join(publicDir, "apple-touch-icon.png"), Buffer.from(await appleRes.arrayBuffer()));

  const favRes = new ImageResponse(box({ width: "100%", height: "100%", alignItems: "center", justifyContent: "center", backgroundColor: "transparent" }, [createLogo(32, false)]), { width: 32, height: 32 });
  const favBuf = Buffer.from(await favRes.arrayBuffer());
  fs.writeFileSync(path.join(publicDir, "favicon-32x32.png"), favBuf);
  fs.writeFileSync(path.join(publicDir, "favicon.ico"), pngToIco(favBuf));

  const p192 = new ImageResponse(box({ width: "100%", height: "100%", alignItems: "center", justifyContent: "center", backgroundColor: "#FAF8F5" }, [createLogo(156, false)]), { width: 192, height: 192 });
  fs.writeFileSync(path.join(iconsDir, "icon-192.png"), Buffer.from(await p192.arrayBuffer()));

  const p512 = new ImageResponse(box({ width: "100%", height: "100%", alignItems: "center", justifyContent: "center", backgroundColor: "#FAF8F5" }, [createLogo(420, false)]), { width: 512, height: 512 });
  fs.writeFileSync(path.join(iconsDir, "icon-512.png"), Buffer.from(await p512.arrayBuffer()));

  console.log("✅ Provisions brand assets generated cleanly!");
}

run().catch((e) => { console.error(e); process.exit(1); });
