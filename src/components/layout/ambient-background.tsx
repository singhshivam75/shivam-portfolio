export function AmbientBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#0d1440_0%,#02030a_60%)]" />
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)]" />
      <div className="absolute -top-1/3 -left-1/4 size-[70vmax] bg-[radial-gradient(closest-side,rgb(139_92_246/0.14),transparent)] md:animate-aurora" />
      <div className="absolute -right-1/4 -bottom-1/3 size-[60vmax] bg-[radial-gradient(closest-side,rgb(34_211_238/0.09),transparent)] [animation-delay:-11s] md:animate-aurora" />
      <div className="absolute top-1/3 left-1/2 hidden size-[40vmax] bg-[radial-gradient(closest-side,rgb(217_70_239/0.07),transparent)] [animation-delay:-5s] md:block md:animate-aurora" />
      <div className="bg-noise absolute inset-0 hidden opacity-[0.035] mix-blend-overlay md:block" />
    </div>
  );
}
