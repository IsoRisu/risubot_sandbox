/**
 * @file js/particles.js
 * @description Particle effects system for explosions, food collection sparkles, trails, and power-up activations.
 */

export class ParticleSystem {
    constructor() {
        /** @type {Array<Object>} */
        this.particles = [];
    }

    /**
     * Spawn an explosion of particles at a given canvas coordinate.
     * @param {number} x 
     * @param {number} y 
     * @param {string} [color='#ef4444'] 
     * @param {number} [count=15] 
     */
    emitExplosion(x, y, color = '#ef4444', count = 15) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 3.5;
            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color,
                size: 2 + Math.random() * 3,
                alpha: 1,
                decay: 0.02 + Math.random() * 0.03
            });
        }
    }

    /**
     * Spawn a gentle trail particle behind the snake head.
     * @param {number} x 
     * @param {number} y 
     * @param {string} [color='#4ade80'] 
     */
    emitTrail(x, y, color = '#4ade80') {
        this.particles.push({
            x: x + (Math.random() - 0.5) * 6,
            y: y + (Math.random() - 0.5) * 6,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            color,
            size: 2 + Math.random() * 2,
            alpha: 0.7,
            decay: 0.05
        });
    }

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= p.decay;
            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    /**
     * Render all active particles on the canvas context.
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw(ctx) {
        ctx.save();
        this.particles.forEach(p => {
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 6;
            ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        });
        ctx.restore();
    }

    clear() {
        this.particles = [];
    }
}
