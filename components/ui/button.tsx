"use client"

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'relative isolate inline-flex items-center justify-center whitespace-nowrap rounded-3xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        glass: 'backdrop-blur-lg bg-[rgba(170,202,255,0.05)] text-foreground border border-[rgba(170,202,255,0.1)]',
      },
      size: {
        default: 'h-11 px-8 py-3',
        sm: 'h-9 rounded-2xl px-4 text-xs',
        lg: 'h-12 rounded-3xl px-10 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, style, onPointerMove, onPointerEnter, onPointerLeave, children, ...props }, ref) => {
    const [isListening, setIsListening] = React.useState(false);
    const [circles, setCircles] = React.useState<Array<{
      id: number;
      x: number;
      y: number;
      color: string;
      fadeState: 'in' | 'out' | null;
    }>>([]);
    const lastAddedRef = React.useRef(0);
    const innerRef = React.useRef<HTMLButtonElement>(null);
    
    const combinedRef = (node: HTMLButtonElement) => {
      // @ts-ignore
      innerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as any).current = node;
    };

    const createCircle = React.useCallback((x: number, y: number) => {
      const buttonWidth = innerRef.current?.offsetWidth || 0;
      const xPos = x / buttonWidth;
      const color = `linear-gradient(to right, var(--circle-start) ${xPos * 100}%, var(--circle-end) ${
        xPos * 100
      }%)`;

      setCircles((prev) => [
        ...prev,
        { id: Date.now(), x, y, color, fadeState: null },
      ]);
    }, []);

    const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
      if (!isListening) return;
      
      const currentTime = Date.now();
      if (currentTime - lastAddedRef.current > 100) {
        lastAddedRef.current = currentTime;
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        createCircle(x, y);
      }
      onPointerMove?.(event);
    };

    const handlePointerEnter = (event: React.PointerEvent<HTMLButtonElement>) => {
      setIsListening(true);
      onPointerEnter?.(event);
    };

    const handlePointerLeave = (event: React.PointerEvent<HTMLButtonElement>) => {
      setIsListening(false);
      onPointerLeave?.(event);
    };

    React.useEffect(() => {
      circles.forEach((circle) => {
        if (!circle.fadeState) {
          setTimeout(() => {
            setCircles((prev) =>
              prev.map((c) =>
                c.id === circle.id ? { ...c, fadeState: 'in' } : c
              )
            )
          }, 0);

          setTimeout(() => {
            setCircles((prev) =>
              prev.map((c) =>
                c.id === circle.id ? { ...c, fadeState: 'out' } : c
              )
            )
          }, 1000);

          setTimeout(() => {
            setCircles((prev) => prev.filter((c) => c.id !== circle.id))
          }, 2200);
        }
      });
    }, [circles]);

    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          "before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:pointer-events-none before:z-[1] before:shadow-[inset_0_0_0_1px_rgba(170,202,255,0.2),inset_0_0_16px_0_rgba(170,202,255,0.1),inset_0_-3px_12px_0_rgba(170,202,255,0.15),0_1px_3px_0_rgba(0,0,0,0.50),0_4px_12px_0_rgba(0,0,0,0.45)] before:mix-blend-multiply before:transition-transform before:duration-300 active:before:scale-[0.975]",
          variant === 'default' && "backdrop-blur-lg bg-[rgba(43,55,80,0.1)] text-foreground"
        )}
        ref={combinedRef}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        style={{
          ...style,
          '--circle-start': 'var(--tw-gradient-from, #a0d9f8)',
          '--circle-end': 'var(--tw-gradient-to, #3a5bbf)',
        } as React.CSSProperties}
        {...props}
      >
        {circles.map(({ id, x, y, color, fadeState }) => (
          <div
            key={id}
            className={cn(
              "absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full",
              "blur-lg pointer-events-none z-[-1] transition-opacity duration-300",
              fadeState === "in" && "opacity-75",
              fadeState === "out" && "opacity-0 duration-[1.2s]",
              !fadeState && "opacity-0"
            )}
            style={{
              left: x,
              top: y,
              background: color,
            }}
          />
        ))}
        {children}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
