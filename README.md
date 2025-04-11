# 𝄡 Music Pearls

**Music Pearls** is a platform for classical music enthusiasts, offering a new way of exploring and discovering music throughout history — from Gregorian chants of the medieval era to modern-day movie soundtracks. 

Unlike traditional music platforms that highlight individual tracks, Music Pearls introduces a fresh perspective by ranking the *complete works* of composers based on popularity. This approach provides deeper insights into how entire compositions have been received and appreciated over time.

The site spans the full timeline of classical music, featuring composers from the Middle Ages through the Renaissance, Baroque, Classical, Romantic, and Contemporary periods — helping users trace the evolution of musical forms and styles across centuries.

The project includes:
- A backend server for data processing and delivery
- A frontend client for rich user interaction
- For information on how the data is fetched and processed, visit the [Pearls Parser repo](https://github.com/MusicPearls/Pearls-Parser)
---

## 🌐 Live Site

Visit: [https://musicpearls.org](https://musicpearls.org)

---

## Features

- 📊 Ranking of the most popular works, by composer and by musical form
- 🎼 Descriptions and historical context of composers, musical forms, and individual works
- 📱 Responsive interface for desktop and mobile

---

## Architecture

- **Frontend**: ReactJS
- **Backend**: ExpressJS
- **Data**: Google Cloud Storage
- **Deployment**: GCP (backend), Vercel (frontend)


## Deployment Notes

- **server** is continuously deployed to Google Cloud Run whenever changes are pushed to the `main` branch.
- **client** since the Github repo belongs to a organization, frontend must be manually deployed:
   ```bash
   vercel login
   npm run build
   vercel
   vercel --prod
   ```

