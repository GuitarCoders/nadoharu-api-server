import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { PaginationFrom } from "../enum/pagination.enum";

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
        () => PaginationFrom, {
            description: "페이지를 탐색할 기준점을 나타냅니다. START는 Start Cursor로부터 이전 정보를, END는 End Cursor로부터 다음 정보를 가져옴을 뜻합니다."
        }
    )
    from: PaginationFrom;

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
            description: "startCursor 기준을 넘어선 데이터가 존재하는지의 여부를 나타냅니다."
        }
    )
    hasOverStart: boolean

    @Field(
        () => Boolean, {
            description: "endCursor 기준을 넘어선 데이터가 존재하는지의 여부를 나타냅니다."
        })
    hasOverEnd: boolean

    @Field(
        () => Boolean, {
            description: "다음 페이지에 대한 항목이 추가로 존재하는지의 여부를 나타냅니다. 만약 pagination 옵션에 until이 있다면, until 커서까지의 여부만 판단합니다. 즉, until 직전까지 데이터를 받았다면 false를 받게 됩니다."
        }
    )
    hasNext: boolean

    @Field(
        () => String, {
            nullable: true,
            description: "쿼리한 페이지의 시작점을 나타냅니다. 정보 누락 없이 이전 페이지를 요청하려면, 해당 Cursor를 기준으로START 방향 페이지를 요청해야 합니다. 페이지에 아무런 정보도 없다면 null을 반환합니다."
        }
    )
    startCursor?: string

    @Field(
        () => String, {
            nullable: true,
            description: "쿼리한 페이지의 끝점을 나타냅니다. 정보 누락 없이 다음 페이지를 요청하려면, 해당 Cursor를 기준으로 END방향 페이지를 요청해야 합니다. 페이지에 아무런 정보도 없다면 null을 반환합니다."
        }
    )
    endCursor?: string
}