import Button from '@/components/common/Button/Button';
import EmphasizedTitle from '@/components/common/EmphasizedTitle/EmphasizedTitle';
import TextArea from '@/components/common/TextArea/TextArea';
import TextField from '@/components/common/TextField/TextField';
import { H2 } from '@/components/common/Typography';
import { headerState } from '@/store/header';
import React, { useLayoutEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useSetRecoilState } from 'recoil';

export default function Description() {
  const { register } = useFormContext();

  const setHeader = useSetRecoilState(headerState);
  useLayoutEffect(() => {
    setHeader(prev => ({
      ...prev,
      thisPage: 4,
      entirePage: 4
    }));
  }, [setHeader]);

  return (
    <div style={{ padding: '20px' }}>
      <div
        style={{
          marginTop: '40px',
          marginBottom: '64px'
        }}
      >
        <EmphasizedTitle>
          <H2>거의 다 됐어요!</H2>
          <H2>보호소를 소개해주세요 🙌</H2>
        </EmphasizedTitle>
      </div>
      <TextArea
        max={300}
        fixHeight={'128px'}
        placeholder="보호소 소개 문구를 300자 내로 작성해주세요."
        errorCallback={e => console.log(e)}
        {...register('description')}
      />
      <Button style={{ marginTop: '38px' }}>저장하기</Button>
    </div>
  );
}
