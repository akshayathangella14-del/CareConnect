import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SafeImage from '@/components/media/SafeImage';
import styles from './ServiceCategories.module.css';

const CATEGORIES = [
  { slug: 'ac-repair', name: 'AC Repair', desc: 'Gas leak, cooling, service', price: 'From ₹499', img: '/images/categories/ac-repair.jpg' },
  { slug: 'refrigerator-repair', name: 'Refrigerator Repair', desc: 'Cooling, compressor, ice', price: 'From ₹399', img: '/images/categories/refrigerator-repair.jpg' },
  { slug: 'plumbing', name: 'Plumbing', desc: 'Leaks, taps, bathrooms', price: 'From ₹299', img: '/images/categories/plumbing.jpg' },
  { slug: 'electrical', name: 'Electrical', desc: 'Wiring, fans, switches', price: 'From ₹249', img: '/images/categories/electrical.jpg' },
  { slug: 'cleaning', name: 'Cleaning', desc: 'Home, kitchen, sofa', price: 'From ₹599', img: '/images/categories/cleaning.jpg' },
  { slug: 'painting', name: 'Painting', desc: 'Interior & exterior', price: 'From ₹999', img: '/images/categories/painting.jpg' },
  { slug: 'carpenter', name: 'Carpenter', desc: 'Furniture, fittings', price: 'From ₹349', img: '/images/categories/carpenter.jpg' },
  { slug: 'pest-control', name: 'Pest Control', desc: 'Safe home treatment', price: 'From ₹799', img: '/images/categories/pest-control.jpg' },
];

export default function ServiceCategories() {
  const scroller = useRef(null);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q')?.toLowerCase() || '';

  useEffect(() => {
    if (!query || !scroller.current) return;
    const match = CATEGORIES.find((c) => c.name.toLowerCase().includes(query));
    if (!match) return;
    const card = scroller.current.querySelector(`[data-slug="${match.slug}"]`);
    card?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [query]);

  const scrollBy = (dir) => {
    scroller.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  return (
    <section id="services" className={styles.section}>
      <div className={styles.head}>
        <div>
          <p className={styles.kicker}>Services</p>
          <h2>Book the help your home needs</h2>
        </div>
        <div className={styles.controls}>
          <button type="button" onClick={() => scrollBy(-1)} aria-label="Previous services"><ChevronLeft /></button>
          <button type="button" onClick={() => scrollBy(1)} aria-label="Next services"><ChevronRight /></button>
        </div>
      </div>
      <div className={styles.track} ref={scroller}>
        {CATEGORIES.map((cat) => (
          <article
            key={cat.slug}
            data-slug={cat.slug}
            className={`${styles.card} ${query && cat.name.toLowerCase().includes(query) ? styles.highlight : ''}`}
          >
            <div className={styles.imageWrap}>
              <SafeImage src={cat.img} fallbackSrc={cat.img.replace('.jpg', '.svg')} alt={`${cat.name} service`} />
            </div>
            <div className={styles.body}>
              <h3>{cat.name}</h3>
              <p>{cat.desc}</p>
              <div className={styles.meta}>
                <span>{cat.price}</span>
                <Link to="/register">Book now</Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
