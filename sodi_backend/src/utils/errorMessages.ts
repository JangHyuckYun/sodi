export const errorMessages = {
  kr: {
    createUser: {
      empty: {
        name: '이름을 입력해 주세요.',
        email: '이메일을 입력해 주세요.',
        password: '비밀번호를 입력해 주세요.',
        country: '도시를 입력해 주세요.',
      },
      matches: {
        password:
          '비밀번호는 8글자 이상, 특수문자(@$!%*#?&) 포함해서 작성해야 합니다.',
        email: '이메일 형식으로 작성해 주세요. ( xxx@xx.xx or xxx@xx.xx.xx )',
      },
    },

    createBoard: {
      empty: {
        title: '게시글의 제목을 입력해주세요.',
        content: '게시글의 내용을 입력해주세요.',
      },
    },
  },
};
