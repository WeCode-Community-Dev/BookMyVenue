import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, ArrowRight, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PlaceCardProps {
  images: string[];
  tags: string[];
  rating: number;
  title: string;
  description: string;
  capacity: number;
  eventTypes: string[];
  className?: string;
  onClick?: () => void;
}

export const PlaceCard = ({
  images,
  tags,
  rating,
  title,
  description,
  capacity,
  eventTypes,
  className,
  onClick,
}: PlaceCardProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Carousel image change handler
  const changeImage = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) return images.length - 1;
      if (nextIndex >= images.length) return 0;
      return nextIndex;
    });
  };

  // Animation variants for the carousel
  const carouselVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  // Animation variants for staggering content
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      variants={contentVariants}
      className={cn(
        'w-full max-w-sm overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-lg cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {/* Image Carousel Section */}
      <div className="relative group h-64">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={title}
            custom={direction}
            variants={carouselVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute h-full w-full object-cover"
          />
        </AnimatePresence>

        {/* Carousel Navigation */}
        <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="rounded-full bg-black/30 hover:bg-black/50 text-white" onClick={(e) => { e.stopPropagation(); changeImage(-1); }}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full bg-black/30 hover:bg-black/50 text-white" onClick={(e) => { e.stopPropagation(); changeImage(1); }}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Top Badges and Rating */}
        <div className="absolute top-3 left-3 flex gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-background/70 backdrop-blur-sm">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="flex items-center gap-1 bg-background/70 backdrop-blur-sm">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" /> {rating}
          </Badge>
        </div>

        {/* Pagination Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(index); }}
              className={cn(
                'h-1.5 w-1.5 rounded-full transition-all',
                currentIndex === index ? 'w-4 bg-white' : 'bg-white/50'
              )}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Content Section */}
      <motion.div variants={contentVariants} className="p-5 space-y-4">
        <motion.div variants={itemVariants} className="flex justify-between items-start">
          <h3 className="text-xl font-bold">{title}</h3>

        </motion.div>



        <motion.p variants={itemVariants} className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </motion.p>

        {/* Specifications Section (Capacity & Event Types) */}
        <motion.div variants={itemVariants} className="pt-3 pb-1 border-t border-white/5 space-y-2.5">
          {/* Capacity */}
          <div className="flex items-center gap-2 text-xs text-white/70">
            <Users className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>Capacity: <strong className="text-white">{capacity} Guests</strong></span>
          </div>

          {/* Event Types */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {eventTypes.map((type) => (
              <Badge key={type} className="bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/20 hover:bg-[#c5a059]/20 text-[10px] font-medium py-0.5 px-2.5 rounded-full">
                {type}
              </Badge>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex justify-between items-center pt-2">

          <Button className="group" onClick={(e) => { e.stopPropagation(); if (onClick) onClick(); }}>
            View Venue
            <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
