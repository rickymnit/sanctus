import { useContent } from '../cms/ContentProvider';

export default function Ticker() {
  const { genres } = useContent();
  const row = [...genres.map((g) => g.name), 'SANCTÜS Radio'];
  const items = [...row, ...row, ...row, ...row];
  return (
    <div className="overflow-hidden border-y border-line bg-signal text-ink" aria-hidden="true">
      <div className="marquee flex w-max py-3">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0">
            {items.map((name, i) => (
              <span key={`${half}-${i}`} className="display flex items-center text-2xl sm:text-3xl">
                <span className="px-5">{name}</span>
                <span className="text-base">✶</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
