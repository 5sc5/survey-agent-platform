import React, { FC, JSX } from "react";
import Head from "next/head";
import Script from "next/script";
import styles from "@/styles/PageWrapper.module.scss"; // 新建样式文件

type PropsType = {
  title: string;
  desc?: string;
  css?: string;
  js?: string;
  children: JSX.Element | JSX.Element[]; // 保持原有类型
};

const PageWrapper: FC<PropsType> = (props: PropsType) => {
  const { title, desc = "", css = "", js = "", children } = props;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {css && <style dangerouslySetInnerHTML={{ __html: css }} />}
      </Head>
      <div className={styles.pageBackground}>
        <div className={styles.card}>{children}</div>
      </div>
      {js && <Script id="page-js" dangerouslySetInnerHTML={{ __html: js }} />}
    </>
  );
};

export default PageWrapper;
