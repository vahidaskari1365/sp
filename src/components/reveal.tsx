"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "default" | "image";
  as?: ElementType;
  id?: string;
};

export default function Reveal({
  children,
  className = "",
  delay = 0,
  variant = "default",
  as,
  id,
}: RevealProps) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      id={id}
      ref={ref}
      data-visible={visible ? "true" : "false"}
      style={{ transitionDelay: `${delay}ms` }}
      className={`${variant === "image" ? "reveal-image" : "reveal"} ${className}`}
    >
      {children}
    </Tag>
  );
}

export function Counter({
  value,
  suffix = "",
  className = "",
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        const duration = 1400;
        const startedAt = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - startedAt) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.round(eased * value));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {new Intl.NumberFormat("fa-IR").format(display)}
      {suffix}
    </span>
  );
}
