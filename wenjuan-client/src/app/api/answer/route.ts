/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { postAnswer } from "@/services/answer";

function genAnswerInfo(reqBody: any) {
  const answerList: any[] = [];

  Object.keys(reqBody).forEach((key) => {
    if (key === "questionId") return;
    answerList.push({
      componentId: key,
      value: reqBody[key],
    });
  });

  return {
    questionId: reqBody.questionId || "",
    answerList,
  };
}

export async function POST(request: NextRequest) {
  // 1. 解析表单数据（关键修改）
  const formData = await request.formData();
  const reqBody: Record<string, any> = {};
  formData.forEach((value, key) => {
    reqBody[key] = value;
  });

  // 2. 格式化数据
  const answerInfo = genAnswerInfo(reqBody);
  console.log("answerInfo", answerInfo);

  try {
    // 3. 提交到服务端 Mock
    const resData = await postAnswer(answerInfo);
    if (resData.errno === 0) {
      return NextResponse.redirect(new URL("/success", request.url));
    } else {
      return NextResponse.redirect(new URL("/fail", request.url));
    }
  } catch (err) {
    return NextResponse.redirect(new URL("/fail", request.url));
  }
}
