import { PublicHome } from '@/components/public-home';

export default function HomePage() {
  return (
    <PublicHome
      defaultFormPath={process.env.DEFAULT_FORM_PATH ?? null}
      links={{
        folder: process.env.LINK_FOLDER ?? '#',
        cheatsheet: process.env.LINK_CHEATSHEET ?? '#',
        table: process.env.LINK_TABLE ?? '#',
        instruction: process.env.LINK_INSTRUCTION ?? '#',
        askQuestion: process.env.LINK_QUESTIONS ?? '#'
      }}
    />
  );
}
