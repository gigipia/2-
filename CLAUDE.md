# CLAUDE.md

이 파일은 Claude Code(claude.ai/code)가 이 폴더의 코드를 다룰 때 참고하는 안내서입니다.

## 개요

`links.html` 한 파일로 된 개인 링크 모음 페이지(대시보드 스타일)입니다. 빌드·패키지·테스트·린트 도구가 없고 git 저장소도 아닙니다. HTML, CSS, JS가 모두 이 파일 안에 들어 있습니다. 외부에서 불러오는 것은 Pretendard 폰트(jsDelivr CDN)와 구글 파비콘 서비스(`google.com/s2/favicons`)뿐입니다.

사용자는 한국어로 대화하며, 페이지 문구도 모두 한국어입니다.

## 실행·확인

- 브라우저에서 파일을 바로 엽니다. PowerShell: `Start-Process "D:\2회차\links.html"`
- 앱 내장 브라우저로 볼 때는 `file:///D:/2회차/links.html` 로 이동합니다. 이 미리보기는 정적 스냅샷이며 `colorScheme` 에뮬레이션이 적용되지 않습니다. 다크 모드를 확인하려면 `document.documentElement.dataset.theme = 'dark'` 를 설정하세요.
- 반응형 확인 기준 폭은 1280px(3열), 960px 이하(2열), 640px 이하(1열, 사이드바가 아래쪽 탭바로 바뀜)입니다. 가로 스크롤이 없어야 합니다.

## 구조

- **테마**: 색은 `:root` CSS 변수로만 정의합니다. 다크 값은 두 곳에 똑같이 있으니 수정할 때 함께 바꿔야 합니다.
  - `@media (prefers-color-scheme: dark)` 안의 `:root:not([data-theme="light"])`
  - `:root[data-theme="dark"]`
  
  사이드바 토글 버튼은 `<html data-theme>` 값을 바꾸고 `localStorage` 의 `theme` 키에 저장합니다. 저장된 값이 없으면 시스템 설정을 따릅니다.
- **레이아웃**: `main > .grid` 안에 카드(`.card`)가 놓입니다. 인사말 카드(`.hello`, 2칸 차지) → 날짜 카드(`.date-card`) → 링크 그룹 카드(`.group.work` / `.study` / `.hobby`) 순서입니다. 그룹 강조색은 `--work` / `--study` / `--hobby` 값을 `--g` 변수로 받아 씁니다. 사이드바 아이콘은 각 그룹의 `id`(`#work` 등)로 이동하는 앵커입니다.
- **링크 추가**: 그룹 안 `.tiles` 에 `<a class="tile" … target="_blank" rel="noopener noreferrer">` 한 줄을 복사해 넣습니다. 그룹별 개수, 전체 링크 수, 그룹 수는 JS가 `.tile` / `.group` 을 세서 표시하므로 직접 고칠 필요가 없습니다. 새 그룹을 만들면 강조색 변수, 클래스, 사이드바 앵커도 함께 추가합니다.
- **스크립트**(파일 맨 아래 `<script>` 하나):
  - 인사말, 날짜, 시계 (`tick()`, 15초마다 갱신)
  - 링크·그룹 개수 계산
  - 테마 토글
  - 랜덤 사이트 버튼
- **움직임 효과**: 카드에 마우스를 올리면 떠오르는 효과는 `@media (hover: none)` 과 `prefers-reduced-motion` 에서 꺼집니다.

## 일부러 넣은 버그 (고치지 말 것)

`#randomButton`("🎲 랜덤 사이트 열기")의 클릭 핸들러에 있는 `Math.flor` 는 사용자가 **디버깅 연습용으로 일부러 넣은 오타**입니다. 누르면 `TypeError: Math.flor is not a function` 이 납니다. 사용자가 고쳐 달라고 하거나 정답을 물어보기 전에는 고치거나 정답을 알려주지 마세요. 힌트를 요청하면 힌트만 줍니다.
