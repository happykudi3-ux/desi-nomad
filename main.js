// Desi Nomad — site behaviour
// Fixes the core bug: nav buttons / destination cards previously had no
// script wiring them to the page-id sections at all.

function showPage(id){
  document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('active'); });
  var target = document.getElementById('page-' + id);
  if(target){ target.classList.add('active'); }
  document.querySelectorAll('.nav-btn').forEach(function(b){
    b.classList.toggle('active', b.getAttribute('data-page') === id);
  });
  document.getElementById('mobileMenu').classList.remove('open');
  window.scrollTo({top:0, behavior:'instant' in window ? 'instant' : 'auto'});
}

document.addEventListener('DOMContentLoaded', function(){

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

  // Auto-play safety: some mobile browsers block autoplay video even when
  // muted+playsinline; retry play() on first user interaction just in case.
  var vids = document.querySelectorAll('video[autoplay]');
  document.body.addEventListener('click', function once(){
    vids.forEach(function(v){ if(v.paused){ v.play().catch(function(){}); } });
    document.body.removeEventListener('click', once);
  }, {once:true});
});
