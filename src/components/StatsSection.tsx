import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Clock, Users, Zap, TrendingUp } from 'lucide-react';

const stats = [
  {
    icon: <Clock className="w-6 h-6" />,
    value: 6,
    suffix: '+',
    label: 'Years Experience',
    color: 'text-primary',
  },
  {
    icon: <Users className="w-6 h-6" />,
    value: 10000,
    suffix: '+',
    label: 'Users Served',
    color: 'text-accent',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    value: 80,
    suffix: '%',
    label: 'Time Reduction',
    color: 'text-terminal-purple',
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    value: 40,
    suffix: '%',
    label: 'Performance Boost',
    color: 'text-terminal-orange',
  },
];

const AnimatedCounter = ({ value, suffix, inView }: { value: number; suffix: string; inView: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    
    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, inView]);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(num >= 10000 ? 0 : 1) + 'K';
    }
    return num.toString();
  };

  return (
    <span className="font-mono font-bold text-4xl md:text-5xl">
      {formatNumber(count)}{suffix}
    </span>
  );
};

const StatsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-mono font-bold mb-4">
            <span className="text-muted-foreground">{'// '}</span>
            <span className="text-gradient-primary">Impact Metrics</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-hover rounded-xl p-6 text-center"
            >
              <div className={`inline-flex p-3 rounded-lg bg-secondary/50 ${stat.color} mb-4`}>
                {stat.icon}
              </div>
              <div className={stat.color}>
                <AnimatedCounter value={stat.value} suffix={stat.suffix} inView={inView} />
              </div>
              <p className="text-muted-foreground text-sm mt-2 font-mono">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;