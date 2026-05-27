/* eslint-disable @typescript-eslint/no-explicit-any */
import { getQuestionById } from "@/services/question";
import { getComponent } from "@/components/QuestionComponents";
import styles from "@/styles/Question.module.scss";
import { Metadata } from "next";
import PageWrapper from "@/components/PageWrapper";
// 定义从 getQuestionById 返回的数据类型
type QuestionData = {
  errno: number;
  data?: {
    id: string;
    title: string;
    desc?: string;
    js?: string;
    css?: string;
    isPublished: boolean;
    isDeleted: boolean;
    componentList: Array<any>;
  };
  msg?: string;
};

// 动态生成页面的 meta 信息（替代原 PageWrapper 中的 title/desc）
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}): Promise<Metadata> {
  // 兼容 Next.js 15/16 中 params 可能是 Promise 的情况
  const { id } = await params;
  const data = (await getQuestionById(id)) as QuestionData;

  if (data.errno !== 0 || data.data?.isDeleted || !data.data?.isPublished) {
    return {
      title: "问卷错误",
      description: "问卷不存在或已被删除",
    };
  }

  return {
    title: data.data.title,
    description: data.data.desc,
  };
}

// 页面组件（Server Component）
export default async function QuestionPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const { id } = await params;
  const data = (await getQuestionById(id)) as QuestionData;
  const { errno, data: questionData, msg = "" } = data;

  // 数据错误
  if (errno !== 0) {
    return (
      <PageWrapper title="错误">
        <h1>错误</h1>
        <p>{msg}</p>
      </PageWrapper>
    );
  }

  const {
    id: questionId,
    title = "",
    desc = "",
    isDeleted,
    isPublished,
    css = "",
    js = "",
    componentList = [],
  } = questionData || {};

  // 已经被删除
  if (isDeleted) {
    return (
      <PageWrapper title={title}>
        <h1>{title}</h1>
        <p>该问卷已经被删除</p>
      </PageWrapper>
    );
  }

  // 尚未发布
  if (!isPublished) {
    return (
      <PageWrapper title={title} desc={desc} css={css} js={js}>
        <h1>{title}</h1>
        <p>该问卷尚未发布</p>
      </PageWrapper>
    );
  }

  // 遍历组件生成 JSX
  const ComponentListElem = (
    <>
      {componentList.map((c) => {
        const ComponentElem = getComponent(c);
        return (
          <div key={c.fe_id} className={styles.componentWrapper}>
            {ComponentElem}
          </div>
        );
      })}
    </>
  );

  // 正常显示问卷表单
  return (
    <PageWrapper title={title} desc={desc} css={css} js={js}>
      <form method="post" action="/api/answer">
        <input type="hidden" name="questionId" value={questionId} />
        {ComponentListElem}
        <div className={styles.submitBtnContainer}>
          <button type="submit">提交</button>
        </div>
      </form>
    </PageWrapper>
  );
}
