# שלב 1: בניית הפרויקט
FROM node:20-alpine AS builder

WORKDIR /app

# העתקת קבצי package
COPY package*.json ./

# התקנת תלויות
RUN npm ci

# העתקת כל הקבצים
COPY . .

# בניית הפרויקט
RUN npm run build

# שלב 2: הרצת הפרויקט
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# התקנת curl ל-healthcheck
RUN apk add --no-cache curl

# העתקת קבצים נדרשים מה-builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/package.json ./package.json

# יצירת משתמש לא-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# שינוי הבעלות על הקבצים
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]

