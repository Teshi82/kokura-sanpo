'use strict';

// Keep navigation and the default route available without JavaScript.
const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');
const mobile = window.matchMedia('(max-width: 760px)');
const navStyle = document.createElement('style');
navStyle.textContent = `@media(max-width:760px){.site-header.js-menu{height:78px;min-height:78px;padding-top:0;flex-wrap:nowrap;position:sticky;gap:12px}.js-menu .menu-toggle{display:flex;flex-direction:column;align-items:center;justify-content:center;border:0;background:transparent;color:var(--green);width:49px;height:49px;gap:6px;padding:3px;cursor:pointer}.menu-label{font-size:8px;letter-spacing:.02em}.menu-icon{width:23px;height:11px;border-top:1px solid var(--green);border-bottom:1px solid var(--green);display:block}.js-menu .main-nav{display:none;position:absolute;left:0;right:0;top:100%;background:var(--paper);padding:15px 7% 24px;border-bottom:1px solid var(--line);box-shadow:0 15px 20px #243c3510}.js-menu .main-nav.is-open{display:flex;flex-direction:column;align-items:stretch;gap:2px}.js-menu .main-nav>a{padding:12px 0;font-size:13px}.js-menu .nav-cta{display:flex;padding:12px 18px;margin-top:10px}.js-menu .main-nav>a:after{display:none}html{scroll-padding-top:95px}}`;
document.head.append(navStyle);
header.classList.add('js-menu');
function closeMenu(returnFocus = false) {
  navigation.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.querySelector('.menu-label').textContent = 'メニュー';
  if (returnFocus) menuButton.focus();
}
menuButton.addEventListener('click', () => {
  const opened = menuButton.getAttribute('aria-expanded') !== 'true';
  navigation.classList.toggle('is-open', opened);
  menuButton.setAttribute('aria-expanded', String(opened));
  menuButton.querySelector('.menu-label').textContent = opened ? '閉じる' : 'メニュー';
});
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') closeMenu(true);
});
document.addEventListener('click', event => {
  if (!header.contains(event.target)) closeMenu();
});
header.addEventListener('focusout', () => {
  window.setTimeout(() => { if (!header.contains(document.activeElement)) closeMenu(); }, 0);
});
mobile.addEventListener('change', () => closeMenu());

const courseData = {
  half: {
    title: ['小倉のいいとこ、', 'ひとめぐり。'],
    description: '城も、市場も、ご当地の味も。小倉の魅力を少しずつ楽しむ、はじめての街歩きに。',
    duration: '3〜4時間',
    waypoints: ['魚町銀天街', '旦過市場', '勝山公園', '小倉城'],
    stops: [
      ['START', 'JR小倉駅から、街へ。', '小倉城口（南口）側から、まち歩きのスタート。'],
      ['SHOPPING & LUNCH', '魚町銀天街で、お昼と寄り道。', 'アーケードをぶらり。焼うどんなど、気になるランチを。'],
      ['LOCAL MARKET', '旦過市場で、小倉の味を発見。', 'お店の営業を確かめて、買い物や手みやげ探しを。'],
      ['RIVERSIDE BREAK', '紫川と勝山公園で、ひと息。', '水辺の景色を眺めながら、城のある公園へ。'],
      ['CASTLE & GOAL', '小倉城を訪ねて、小倉駅へ。', '展示や眺めを楽しんだら、駅まで気ままに歩いて戻ろう。']
    ]
  },
  short: {
    title: ['水辺の風に、', '歩幅を合わせて。'],
    description: '予定を詰め込まず、川とお城の風景を楽しむ時間。小倉城は外観を眺めるプランです。',
    duration: '約2時間',
    waypoints: ['紫川 鴎外橋', '勝山公園', '小倉城'],
    stops: [
      ['START', 'JR小倉駅から、気ままに出発。', '小倉城口（南口）側から、川のある風景を目指して。'],
      ['RIVERSIDE', '紫川のほとりを、のんびり。', '鴎外橋の周辺へ。橋や川辺から、街の景色を楽しもう。'],
      ['PARK & CASTLE', '勝山公園と小倉城の外観を楽しむ。', '緑の中で休憩。お城の写真を撮りながら、ゆっくり散策。'],
      ['GOAL', '寄り道しながら、小倉駅へ。', '余裕があれば喫茶店でひと休み。帰りの時間に合わせて駅へ。']
    ]
  }
};
const courseButtons = [...document.querySelectorAll('[data-course]')];
courseButtons.forEach(button => button.addEventListener('click', () => {
  const data = courseData[button.dataset.course];
  courseButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  const title = document.getElementById('course-name');
  title.replaceChildren(document.createTextNode(data.title[0]), document.createElement('br'), document.createTextNode(data.title[1]));
  document.getElementById('course-description').textContent = data.description;
  document.getElementById('course-duration').textContent = data.duration;
  const timeline = document.getElementById('timeline');
  timeline.replaceChildren(...data.stops.map((stop, index) => {
    const li = document.createElement('li');
    const number = document.createElement('span');
    number.className = 'step-number';
    number.textContent = String(index + 1).padStart(2, '0');
    const body = document.createElement('div');
    const meta = document.createElement('span');
    meta.className = 'step-meta';
    meta.textContent = stop[0];
    const heading = document.createElement('h4');
    heading.textContent = stop[1];
    const description = document.createElement('p');
    description.textContent = stop[2];
    body.append(meta, heading, description);
    li.append(number, body);
    return li;
  }));
  const params = new URLSearchParams({api: '1', origin: '小倉駅', destination: '小倉駅', waypoints: data.waypoints.join('|'), travelmode: 'walking'});
  document.getElementById('route-map').href = 'https://www.google.com/maps/dir/?' + params;
}));
