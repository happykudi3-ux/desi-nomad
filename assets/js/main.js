// Desi Nomad — site behaviour
// Fixes the core bug: nav buttons / destination cards previously had no
// script wiring them to the page-id sections at all.

function showPage(id, opts){
  opts = opts || {};
  var target = document.getElementById('page-' + id);
  if(!target){ id = 'home'; target = document.getElementById('page-home'); }
  document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('active'); });
  target.classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(function(b){
    b.classList.toggle('active', b.getAttribute('data-page') === id);
  });
  document.getElementById('mobileMenu').classList.remove('open');
  window.scrollTo({top:0, behavior:'instant' in window ? 'instant' : 'auto'});

  // Show/hide the header back button — hidden on the home page, visible
  // everywhere else, since "home" is the one place there's nothing to go
  // back to.
  var backBtn = document.getElementById('backBtn');
  if(backBtn){ backBtn.style.display = (id === 'home') ? 'none' : ''; }

  // Browser back/forward support: every in-app navigation pushes a history
  // entry with the page id, so the device's/browser's own back button steps
  // back through the pages the person actually visited instead of leaving
  // the site. `opts.fromPopState` is set when we're already responding to
  // a back/forward event, so we don't push a duplicate entry in that case.
  if(!opts.fromPopState){
    var url = id === 'home' ? (location.pathname + location.search) : ('#' + id);
    if(opts.replace){
      history.replaceState({page:id}, '', url);
    } else {
      history.pushState({page:id}, '', url);
    }
  }
}

document.addEventListener('DOMContentLoaded', function(){

  // Establish the initial history entry from the URL hash (so a direct
  // link like desi-nomad.com/#manali opens on that page), without pushing
  // a duplicate entry for the page that's already loaded.
  var startId = (location.hash || '').replace('#','') || 'home';
  showPage(startId, {replace:true});

  // Wire the header back button to the browser's own back/forward stack.
  var backBtn = document.getElementById('backBtn');
  if(backBtn){
    backBtn.addEventListener('click', function(){ history.back(); });
  }

  // Respond to the browser/device back and forward buttons.
  window.addEventListener('popstate', function(e){
    var page = (e.state && e.state.page) || (location.hash || '').replace('#','') || 'home';
    showPage(page, {fromPopState:true});
  });

  // Wire every nav-btn (header + mobile menu)
  document.querySelectorAll('.nav-btn[data-page]').forEach(function(btn){
    btn.addEventListener('click', function(){ showPage(btn.getAttribute('data-page')); });
  });

  // Wire every destination card that has data-page
  document.querySelectorAll('[data-page]:not(.nav-btn)').forEach(function(el){
    el.addEventListener('click', function(){ showPage(el.getAttribute('data-page')); });
  });

  // Mobile menu toggle
  var menuToggle = document.getElementById('menuToggle');
  var mobileMenu = document.getElementById('mobileMenu');
  if(menuToggle){
    menuToggle.addEventListener('click', function(){
      mobileMenu.classList.toggle('open');
    });
  }

  // Destination filter tabs (bucketlister-style segmented filter)
  document.querySelectorAll('.seg').forEach(function(seg){
    seg.addEventListener('click', function(e){
      var btn = e.target.closest('button[data-filter]');
      if(!btn) return;
      seg.querySelectorAll('button').forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.getAttribute('data-filter');
      var grid = seg.closest('section').querySelector('.dest-photo-grid');
      if(!grid) return;
      grid.querySelectorAll('.dcard').forEach(function(card){
        var cats = (card.getAttribute('data-cat') || '').split(' ');
        card.style.display = (filter === 'all' || cats.indexOf(filter) !== -1) ? '' : 'none';
      });
    });
  });

  // Ask Hazel launcher
  var launcher = document.getElementById('hazelLauncher');
  var panel = document.getElementById('hazelPanel');
  var closeBtn = document.getElementById('hazelClose');
  var iframeLoaded = false;
  function openHazel(){
    panel.classList.add('open');
    if(!iframeLoaded){
      var iframe = document.getElementById('hazelFrame');
      iframe.src = iframe.getAttribute('data-src');
      iframeLoaded = true;
    }
  }
  if(launcher){ launcher.addEventListener('click', openHazel); }
  if(closeBtn){ closeBtn.addEventListener('click', function(){ panel.classList.remove('open'); }); }

  // Rotating hero background (bucketlister-style): crossfade between a
  // handful of clips instead of looping just one. Each <video> keeps
  // playing in the background the whole time (muted, looped) so there's
  // no restart stutter when it fades back in.
  var heroVids = document.querySelectorAll('.vhero-bg');
  if(heroVids.length > 1){
    heroVids.forEach(function(v){ v.play().catch(function(){}); });
    var heroIdx = 0;
    setInterval(function(){
      heroVids[heroIdx].classList.remove('active');
      heroIdx = (heroIdx + 1) % heroVids.length;
      var next = heroVids[heroIdx];
      next.classList.add('active');
      if(next.paused){ next.play().catch(function(){}); }
    }, 6000);
  }

  // Auto-play safety: some mobile browsers block autoplay video even when
  // muted+playsinline; retry play() on first user interaction just in case.
  var vids = document.querySelectorAll('video[autoplay]');
  document.body.addEventListener('click', function once(){
    vids.forEach(function(v){ if(v.paused){ v.play().catch(function(){}); } });
    document.body.removeEventListener('click', once);
  }, {once:true});
});
