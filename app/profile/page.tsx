import '@root/global.scss';

import { convertObjectKeysToCamelCase } from '@root/common/utilities';
import { cookies } from 'next/headers';
import { fetchPostgresExisitingUserRecord } from '@root/resolvers/PostgresResolvers';
import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import { ProviderProfile, UserProfileTypeEnum } from '@root/common/types';
import Page from '@components/Page';
import ProviderProfileSection from '@root/pages/sections/ProviderProfileSection';

const title = 'Nova Energy - Create a  Profile ';
const description = 'This is your profile';

function getCookies() {
  const userId = cookies().get('userId');
  const sitekey = cookies().get('sitekey');

  if (userId && sitekey) {
    return NextResponse.json({ userId: userId, sitekey: sitekey });
  } else {
    return NextResponse.json({ userId: null, sitekey: null });
  }
}

export default async function ProfilePage(props) {
  const cookie = await getCookies();
  const cookieJson = await cookie.json();

  const userId = cookieJson?.userId?.value;
  const sitekey = cookieJson?.sitekey?.value;

  if (!userId) return redirect('/app');

  const records = await Promise.all([fetchPostgresExisitingUserRecord({ sitekey, userId })]);
  const profile = records[0]?.data?.profile ?? null;
  if (profile?.profile_type == UserProfileTypeEnum.AUDITOR) return redirect('/app');
  if (!profile) return redirect('/create-provider-profile');

  const data = records[0]?.data?.profile ?? null;
  const profileData = convertObjectKeysToCamelCase(data) as ProviderProfile;

  return (
    <Page title={title} description={description} url="https://novaenergy.ai/profile">
      <ProviderProfileSection profileData={profileData} userId={userId} sitekey={sitekey} />
    </Page>
  );
}
