import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { pad, useRadio, widgetSrc } from './radio';

// Sticky Mixcloud player. Stays mounted while the visitor scrolls the site.
export default function PlayerBar() {
  const { playing, stop } = useRadio();

  return (
    <>
    {/* Spacer so the fixed bar never covers the footer */}
    {playing && <div className="h-[76px]" aria-hidden="true" />}
    <AnimatePresence>
      {playing && (
        <motion.div
          key="player"
          className="fixed inset-x-0 bottom-0 z-[55] border-t border-line bg-ink/95 backdrop-blur-md"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'tween', duration: 0.35 }}
        >
          <div className="gutter mx-auto flex max-w-site items-center gap-4 py-2">
            <div className="hidden w-56 shrink-0 items-center gap-3 lg:flex">
              <span className="eq flex items-end gap-[3px] text-signal"><span /><span /><span /></span>
              <div className="min-w-0">
                <p className="label text-signal">SANCTÜS Radio · EP {pad(playing.number)}</p>
                <p className="truncate text-sm font-semibold">{playing.name}</p>
              </div>
            </div>
            <iframe
              key={playing.key}
              title={`SANCTÜS Radio: ${playing.name}`}
              src={widgetSrc(playing.key)}
              className="h-[60px] min-w-0 flex-1"
              allow="autoplay"
              frameBorder="0"
            />
            <button onClick={stop} className="grid h-10 w-10 shrink-0 place-items-center border border-line hover:border-bone" aria-label="Close player">
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
