import { motion, useReducedMotion } from 'framer-motion';

// One-shot fade-up on enter. Respects reduced motion.
export function Reveal({ as = 'div', delay = 0, className, children, ...rest }) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.7, 0.2, 1] }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// Numbered section header used across the page: "02 — Sound"
export function SectionHead({ index, label, title, aside, className = '' }) {
  return (
    <header className={`gutter mx-auto max-w-site ${className}`}>
      <div className="rule flex items-center justify-between pt-4">
        <span className="label">
          <span className="text-signal">{index}</span> / {label}
        </span>
        {aside && <span className="label hidden sm:block">{aside}</span>}
      </div>
      {title && (
        <Reveal as="h2" className="display mt-8 text-[clamp(3rem,11vw,10rem)]">
          {title}
        </Reveal>
      )}
    </header>
  );
}

export function ExtLink({ href, children, className = '' }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}
