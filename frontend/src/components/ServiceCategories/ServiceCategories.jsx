import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import SafeImage from '@/components/media/SafeImage';
import { useListCategoriesQuery } from '@/features/categories';
import styles from './ServiceCategories.module.css';

const categoryImageMap = {
  plumbing: '/images/categories/plumbing.jpg',
  'ac-repair': '/images/categories/ac-repair.jpg',
  'appliance-repair': '/images/categories/ac-repair.jpg',
  'refrigerator-repair': '/images/categories/refrigerator-repair.jpg',
  electrical: '/images/categories/electrical.jpg',
  cleaning: '/images/categories/cleaning.jpg',
  painting: '/images/categories/painting.jpg',
  carpenter: '/images/categories/carpenter.jpg',
  'pest-control': '/images/categories/pest-control.jpg',
};

const DEFAULT_CATEGORIES = [
  { _id: 'cat-1', name: 'Cleaning', slug: 'cleaning', description: 'Deep home & office cleaning by experts', basePrice: 999 },
  { _id: 'cat-2', name: 'Electrical', slug: 'electrical', description: 'Wiring, switches, and electrical repairs', basePrice: 199 },
  { _id: 'cat-3', name: 'Plumbing', slug: 'plumbing', description: 'Leak fixing, pipe fitting & water works', basePrice: 299 },
  { _id: 'cat-4', name: 'Painting', slug: 'painting', description: 'Wall painting, texture & home touchups', basePrice: 1499 },
  { _id: 'cat-5', name: 'Carpenter', slug: 'carpenter', description: 'Furniture repair, fitting & wood works', basePrice: 349 },
  { _id: 'cat-6', name: 'AC Repair', slug: 'ac-repair', description: 'Expert air conditioning service & maintenance', basePrice: 499 },
  { _id: 'cat-7', name: 'Pest Control', slug: 'pest-control', description: 'Termite, cockroach & complete pest treatment', basePrice: 799 },
  { _id: 'cat-8', name: 'Refrigerator', slug: 'refrigerator-repair', description: 'Fridge repair, gas refill & compressor fix', basePrice: 399 },
];



export default function ServiceCategories() {
  const scroller = useRef(null);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q')?.toLowerCase() || '';
  const { data: apiCategories = [], isLoading } = useListCategoriesQuery();

  const categories = apiCategories.length > 0 ? apiCategories : DEFAULT_CATEGORIES;

  useEffect(() => {
    if (!query || !scroller.current || categories.length === 0) return;
    const match = categories.find((c) => c.name?.toLowerCase().includes(query));
    if (!match) return;
    const card = scroller.current.querySelector(`[data-slug="${match.slug}"]`);
    card?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [query, categories]);

  const scrollBy = (dir) => {
    scroller.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <section id="services" className={styles.section}>
        <div className={styles.head}>
          <div>
            <p className={styles.kicker}>Services</p>
            <h2>Loading live service categories...</h2>
          </div>
        </div>
        <div className={styles.track}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      </section>
    );
  }

  const displayCategories = categories.length >= 8 ? categories : [...categories, ...DEFAULT_CATEGORIES.filter(dc => !categories.some(c => c.slug === dc.slug || c.name.toLowerCase() === dc.name.toLowerCase()))].slice(0, 8);

  if (displayCategories.length === 0) {
    return null;
  }

  return (
    <section id="services" className={styles.section}>
      <div className={styles.head}>
        <div>
          <p className={styles.kicker}>Services</p>
          <h2>Book the help your home needs</h2>
        </div>
        <div className={styles.controls}>
          <button type="button" onClick={() => scrollBy(-1)} aria-label="Previous services">
            <ChevronLeft size={20} />
          </button>
          <button type="button" onClick={() => scrollBy(1)} aria-label="Next services">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div className={styles.track} ref={scroller}>
        {displayCategories.map((cat, index) => {
          const slug = cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-');
          const image = cat.image || categoryImageMap[slug] || '/images/categories/plumbing.jpg';
          const priceText = cat.basePrice ? `From ₹${cat.basePrice}` : 'Flexible pricing';

          return (
            <article
              key={cat._id || slug}
              data-slug={slug}
              className={`${styles.card} ${query && cat.name?.toLowerCase().includes(query) ? styles.highlight : ''}`}
              style={{ '--index': index }}
            >
              <div className={styles.imageWrap}>
                <SafeImage src={image} fallbackSrc={image} alt={`${cat.name} service`} />
                <div className={styles.priceBadge}>{priceText}</div>
              </div>
              <div className={styles.body}>
                <h3>{cat.name}</h3>
                <p>{cat.description || 'Tailored service for your home.'}</p>
                <Link to="/register" className={styles.bookLink}>
                  Book now <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
