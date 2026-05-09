import { PublicHome } from '@/components/public-home';
import { getAppLinks } from '@/lib/links';

export default function HomePage() {
  const links = getAppLinks();

  return (
    <PublicHome
      defaultFormPath="/form"
      links={links}
    />
  );
}
