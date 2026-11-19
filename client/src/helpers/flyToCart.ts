export const flyToCart = (from: HTMLElement, imageUrl?: string) => {
  // "လှုပ်ရှားမှုလျှော့" ဖွင့်ထားသူအတွက် animation ကျော်
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

  // Desktop/Mobile cart ခလုတ် နှစ်ခုထဲက မြင်နေတဲ့ဟာကို ရွေး
  const target = [
    ...document.querySelectorAll<HTMLElement>("[data-cart-target]"),
  ].find((el) => el.getBoundingClientRect().width > 0)
  if (!target) return

  const a = from.getBoundingClientRect()
  const b = target.getBoundingClientRect()
  const size = 56

  const startX = a.left + a.width / 2 - size / 2
  const startY = a.top + a.height / 2 - size / 2
  const dx = b.left + b.width / 2 - size / 2 - startX
  const dy = b.top + b.height / 2 - size / 2 - startY

  const ghost = document.createElement(imageUrl ? "img" : "div")
  if (ghost instanceof HTMLImageElement && imageUrl) ghost.src = imageUrl
  ghost.setAttribute("aria-hidden", "true")
  Object.assign(ghost.style, {
    position: "fixed",
    left: `${startX}px`,
    top: `${startY}px`,
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: "50%",
    objectFit: "cover",
    background: "#9333ea", // ပုံမရှိရင် ခရမ်းရောင်ဘောလုံး
    boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
    zIndex: "9999",
    pointerEvents: "none",
  })
  document.body.appendChild(ghost)

  // အပေါ်ကို ပစ်တက်ပြီး cart ထဲ ကျသွားတဲ့ ကွေးလမ်းကြောင်း
  const flight = ghost.animate(
    [
      { transform: "translate(0, 0) scale(1)", opacity: 1 },
      {
        transform: `translate(${dx * 0.55}px, ${dy * 0.5 - 70}px) scale(0.75)`,
        opacity: 1,
        offset: 0.5,
      },
      {
        transform: `translate(${dx}px, ${dy}px) scale(0.2)`,
        opacity: 0.5,
      },
    ],
    { duration: 700, easing: "cubic-bezier(0.45, 0, 0.55, 1)" }
  )

  flight.finished
    .then(() => {
      // ရောက်သွားတဲ့အခါ cart icon ကို ဖောင်းပေး
      target.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(1.25)" },
          { transform: "scale(1)" },
        ],
        { duration: 300, easing: "ease-out" }
      )
    })
    .catch(() => {})
    .finally(() => ghost.remove())
}
