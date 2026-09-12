# Desi Nomad — rebuilt site, deploy notes

## What changed
- **Fixed the core bug**: the destination "tabs" now work — the old site had zero JavaScript, so the buttons never did anything. `assets/js/main.js` wires up navigation, the destination filter tabs, the mobile menu, and the Ask Hazel chat launcher.
- **New look**: sage-green palette, real hero + "moments" video (your 3 clips, transcoded to web-friendly MP4/WebM), bucketlister-style segmented filter tabs and photo cards for destinations.
- **All real content preserved**: every hotel name, price, rating, and Google Maps link for Manali, Nainital, Kasol, Coorg, Ooty, Kodaikanal, and Thekkady was carried over from the live site — only the colors/layout changed around it.
- **Ask Hazel** is integrated as a floating chat launcher (bottom-right) that opens your Hazel app (https://desi-nomads-hazel.vercel.app/) in a slide-in panel, with an "Open full screen ↗" link as a fallback.

## Content issues found while rebuilding (need your input)
1. **Ladakh, Spiti, and Munnar were marked "Guide live" but have no actual page content** — clicking them did nothing even before the nav bug. I've relabeled all three "Coming soon" until you have real hotel data for them. Let me know if you actually do have that data written somewhere and I missed it.
2. **Kodaikanal's page is missing its ending**: the live site's HTML file cuts off mid-sentence ("Hotel data supp...") right after the hotel list. The "Where to eat" and "Getting there & around" / "Best time to visit" sections for Kodaikanal don't exist anywhere in the current live site — they were never saved, not just hidden by the bug. I've left a clearly marked editor's note on that page instead of inventing content. Send me the real text (or the missing source-note) and I'll drop it straight in.
3. **The "About" page** was linked in the old nav but had no matching content anywhere in the live HTML either — I removed the dead link for now. If you have About-page copy, send it and I'll add it back properly.
4. Photos for **Spiti, Munnar, and Pahalgam** aren't included since they're "Coming soon" — I didn't want to attach a random stock photo to a destination with no guide yet. Real photos + copy can go in once those guides are researched.

## Deploying this to desi-nomad.com (Netlify)
1. Create a new GitHub repo (you mentioned you can't find the old one — a new one is fine).
2. Push everything in this folder (`index.html` + `assets/`) to that repo's root.
3. In Netlify: **Add new site → Import an existing project → GitHub**, pick the new repo. Build command: none needed (it's a static site) — just set the publish directory to the repo root (`/`).
4. Once it deploys and you've confirmed the Netlify subdomain looks right, go to **Domain settings** on that new Netlify site and add `desi-nomad.com` as a custom domain, then repoint your domain's DNS (or the domain itself, if it's managed by Netlify) to the new site the same way it pointed to the old one.
5. Netlify will auto-issue HTTPS for the domain once DNS is pointed correctly — this can take a few minutes.

If you'd rather skip Git entirely for now: Netlify also supports dragging this whole folder straight onto the "Sites" page for a manual deploy — good for previewing before you wire up GitHub.
