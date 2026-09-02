# aneesh-iyer.com

Personal site of Aneesh Iyer. Vite, React 18, TypeScript, Tailwind CSS, and framer-motion, deployed to GitHub Pages from `main`.

- Content lives in `src/data` (profile, experience, projects, skills) and mirrors the resume content bank in the `aneesh-iyer29` repo.
- Project figures live in `src/components/demos`: static on the home page, interactive on each project page. The EKF chart plots data exported from the flight software test harness (`src/data/esekf-replay.json`); the heat model reproduces the M3 paper; the Build figure uses the real SupChain-Bench template and compile step from the Build app.
- Case-study deep dives live in `src/pages/projects/pages`.

```bash
npm install
npm run dev
```
