'use client';
import Image from 'next/image';
import * as styles from './Banner.css';
import { useRouter } from 'next/navigation';
import { Caption2 } from '@/components/common/Typography';
import { ArrowRight } from '@/asset/icons';

interface BannerProps {
  name: string;
  shelterId?: string;
}

export default function Banner({ name, shelterId }: BannerProps) {
  return (
    <section>
      <div className={styles.container}>
        <div className={styles.titleWrapper}>
          <h1>안녕하세요! {name && <span>{name}님.</span>}</h1>
          <h1>더 나은 세상을 만들어봐요</h1>
        </div>
        <a className={styles.infoLink} href="#">
          <Caption2 color="gray600">댕글댕글 서비스를 소개합니다</Caption2>
          <ArrowRight />
        </a>
        {shelterId && <MyShelterHomeButton shelterId={shelterId} />}
      </div>
    </section>
  );
}

const MyShelterHomeButton = ({ shelterId }: { shelterId: string }) => {
  const router = useRouter();
  const moveToHome = () => {
    router.push(`/shelter/${shelterId}`);
  };
  return (
    <button className={styles.myShelterHomeButton} onClick={moveToHome}>
      MY 보호소 홈
    </button>
  );
};
