import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";

@InputType(
    {description: "한 페이지를 가져오기 위해 필요한 입력 데이터입니다. 시작점, 끝점, 페이지 당 항목 갯수를 입력합니다."}
)
export class PaginationInput {
    @Field(
        () => String, {
            nullable: true,
            description: "페이지네이션 시작점을 나타냅니다. 해당 항목을 생략하면 쿼리를 요청한 시간을 시작점으로 정합니다."
        }
    )
    cursor?: string;

    @Field(
        () => String, {
            nullable: true,
            description: "페이지네이션 끝점을 나타냅니다. 해당 항목을 생략하면 시작점으로 부터 제한 없이 결과를 가져옵니다."
        }
    )
    until?: string;

    @Field(
        () => Int, {
            nullable: true,
            description: "한 페이지에 포함할 객체의 갯수를 나타냅니다. 해당 항목을 생략하면 각각의 쿼리에 대한 기본값으로 limit를 정합니다."
        }
    )
    limit?: number;
}

@ObjectType(
    {description: "페이지네이션 결과를 표현하는 객체입니다. 주로 다음 페이지를 가져오기 위한 정보를 표현합니다."}
)
export class PageInfo {
    @Field(
        () => Boolean, {
            description: "다음 페이지에 대한 항목이 추가로 존재하는지의 여부를 나타냅니다. 해당 값이 true라면, 쿼리 결과 항목을 한 페이지에 전부 담지 못했음을 의미합니다."
        })
    hasNext: boolean

    @Field(
        () => String, {
            nullable: true,
            description: "쿼리한 페이지의 끝점을 나타냅니다. 정보 누락 없이 다음 페이지를 요청하려면, 해당 Cursor를 시작점으로 다음 페이지를 요청해야 합니다. 페이지에 아무런 정보도 없다면 null을 반환합니다."
        }
    )
    cursor?: string
}