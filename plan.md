# SCP | Beta-1 “Cauterizers” — Uygulama Planı

## Ürün kapsamı

Bu proje, SCP | Beta-1 “Cauterizers” birimini tanıtan tek sayfalı, atmosferik bir web sitesi olacak. Ön yüz statik dosyalar olarak sunulacak; başvuru gönderimi Node sunucu uç noktası üzerinden kullanıcı tarafından seçilen Discord kanalına yapılacak. Veritabanı/kalıcı başvuru kopyası tutulmayacak; webhook URL’si korumalı ortam değişkeninde saklanacak.

Uygulama vanilla HTML, CSS ve JavaScript ile kurulacak. Bu seçim, kısa ve hızlı açılan bir tanıtım sitesi için bağımlılık yükünü düşük tutarken; yükleme ekranı, menü geçişleri, kağıt animasyonu, Web Audio ses efekti ve kaydırma tabanlı açılma efektlerinin tam kontrolünü sağlar.

## Uygulama yaklaşımı

- `server.js`, yalnızca site giriş dosyalarını ve `public/` içindeki açık varlıkları allowlist üzerinden `0.0.0.0:3000` üzerinde servis edecek; `POST /api/applications` başvurularını doğrulayıp sabit hedef kanalın webhook’una aktaracak ve `/_healthz` sağlık yanıtı verecek. Proje kaynak/kontrol dosyalarına HTTP üzerinden erişim verilmeyecek.
- `index.html` ana içerik kabuğunu, semantik bölümleri, yükleme ekranını ve başvuru formunu taşıyacak.
- `styles.css` görsel sistemi, responsive yerleşimi, tarama çizgilerini, ışık parlamalarını, sansür bloklarını, kağıt geçiş katmanını ve hareket azaltma tercihlerini yönetecek.
- `script.js` yükleme yüzde akışını, %100 sonrası “Yükleniyor..” metnini ve geçişi; açılır sol menüyü; bölüm navigasyonunu; uçuşan kağıtları; Web Audio efektini; `IntersectionObserver` ile scroll reveal davranışını ve form durumunu yönetecek.
- `public/manus-routes.json` mevcut tek sayfa rotasını `/` olarak ilan edecek.
- `app.config.ts` platform proje logosu için Beta-1 logosunun HTTPS adresini literal olarak taşıyacak.
- Site durumu içerikte başlangıçta **AKTİF** olarak gösterilecek; `data-status` niteliğiyle gerektiğinde `İN AKTİF` veya `BAKIMDA` metnine çevrilebilecek.

## Sayfa ve içerik akışı

1. **Açılış / yükleme:** Koyu ekran, Beta-1 sembolü, yüzde sayacı, ilerleme çizgisi ve yüzde 100 sonrası `Yükleniyor..` metni. Kısa beklemeden sonra ana içerik görünür.
2. **Ana Sayfa:** “Cauterizers” başlığı, Beta-1 açıklaması, durum etiketi, Discord’a katıl CTA’sı ve alakalı logo/operator/patch görselleri.
3. **Anlaşmalı Sunucular:** Omega-45 “Street Samurai” için https://discord.gg/hKWbNb7B4 ve “Düşman Gruplar / Sternritter Gang” için https://discord.gg/vf9ZGR6QJ bağlantı kartları.
4. **Başvuru Yap!:** Roblox adı, Discord adı, RP terimleri, Beta-1 bilgisi, daha önce görev yaptığı yerler, hesap yaşı ve günlük aktiflik soruları. Günlük aktiflik için yalnızca `1-2`, `2-3`, `4+` seçenekleri. Gönderimde tüm cevaplar hedef Discord kanalına iletilir; başvuru yapan kişiye kanal erişimi olanların cevapları görebileceği bildirilir.
5. **Birimimizi daha yakından tanı:** Birimin görev alanı, operasyon ilkeleri, seçilmiş gizlilik notları ve sansürlü bilgi blokları.
6. **Alt bölüm:** Discord bağlantısı, “gizli dosya / erişim protokolü” mikro metni ve site durumu.

Menü öğeleri sırasıyla **Ana Sayfa**, **Yönetim Kadrosu**, **Anlaşmalı Sunucular**, **Başvuru Yap!**, **Birimimizi daha yakından tanı** olacak.

## Etkileşim ve hareket

- Sol menü masaüstünde sabit bir rail olarak açılıp kapanacak; mobilde tam yükseklikli drawer davranışına geçecek.
- Menüden bölüm değiştirirken perde gibi tek katman yerine farklı konum ve açılarda çok sayıda kağıt parçası yukarıdan aşağı dökülüp zemine konacak.
- Web Audio API ile harici dosya gerektirmeyen kısa, düşük seviyeli “paper snap / terminal chirp” efekti çalacak. Kullanıcı etkileşimi olmadan ses başlatılmayacak.
- Bölümler `IntersectionObserver` ile görünür oldukça açılacak; `prefers-reduced-motion: reduce` etkinse hareketler sadeleşecek.
- Bölüm navigasyonu `scrollIntoView` kullanacak, URL rotası değişmeyecek; bu nedenle tek rota manifesti yeterli olacak.
- Form alanları tarayıcı ve sunucuda doğrulanacak; başarılı başvuru webhook üzerinden hedef kanala bütün cevaplarıyla gönderilecek. Payload yalnızca işlem süresince bellekte tutulacak, loglara yazılmayacak veya kalıcı veritabanına alınmayacak.
- Sol menü vurguları kırmızıyla; logo, ilerleme çubuğu ve genel site odağı saha yeşili ve koyu grafitle korunacak.

## Tasarım sistemi

### Design Movement

**Classified dossier / cyber-noir askeri arşiv**: SCP dosya estetiğinin bürokratik düzenini, operasyon merkezlerinin karanlık ekranları ve lazer çizgileriyle birleştiren kontrollü bir görsel dil.

### Core Principles

1. **Kontrollü tehdit:** Her parlama ve kırmızı uyarı bir bilgi hiyerarşisine hizmet eder; dekoratif gürültü okunabilirliği bastırmaz.
2. **Arşiv katmanları:** Paneller, dosya numaraları, durum etiketleri ve sansür blokları sitenin tüm bölümlerinde tekrarlanan bir bilgi mimarisi oluşturur.
3. **Hareketli geçiş:** Kağıt geçişi ve tarama ışığı, menü değişimini bir dosya açma ritüeline dönüştürür.
4. **İşlevsel yoğunluk:** Keskin CTA’lar, net form alanları ve rol kartları oyun topluluğuna hızlı taranabilir bilgi verir.

### Color Philosophy

Arka planda mürekkep siyahı ve soğuk grafit kullanılır; bu, güvenlik ekranı ve kapalı arşiv hissini verir. Ana marka vurgu rengi **muted saha yeşili** (`#a9d887`), Beta-1’in gözetim ve karşı-istihbarat tonunu taşır. Tehlike ve durum uyarıları için kontrollü soluk kızıl (`#d27569`) kullanılır. Sıcak kâğıt tonu (`#e7dcc5`) yalnızca geçiş parçalarında ve eski dosya detaylarında görünür; böylece hareket anında kontrast yaratır.

### Layout Paradigm

Merkezde tek büyük bir kart yerine, solda hiyerarşik bir komuta rail’i ve sağda genişleyen “dosya sayfaları” kullanılacak. Hero alanı tam genişlikli görsel/ışık katmanına sahip olacak; içerik bölümleri sağ tarafta asimetrik kolonlar ve kenar notlarıyla ilerleyecek. Mobilde rail üstten açılan drawer’a dönüşür ve içerik tek kolon akışına iner.

### Signature Elements

- Saha yeşili tarama ışıkları, kırmızı sol menü vurgusu ve ince lazer parlamaları.
- Siyah blok üstüne arşiv numarası, durum chip’i ve monospaced mikro etiketler.
- Menü geçişinde yukarıdan düşen krem renkli dosya sayfaları ve sansürlü bilgi bantları.

### Interaction Philosophy

Kullanıcı bir “ziyaretçi” değil, dosyaya erişen bir operatör gibi hissetmeli. Menü açmak bir komuta paneli açar; bölüm seçmek dosya değiştirir; Discord CTA’sı erişim protokolünü tamamlar. Etkileşimler kısa, belirgin ve geri bildirimi olan davranışlar olarak uygulanır.

### Animation

Yükleme ekranı çizgisel ve ölçülü ilerler; %100 sonrasında metin kısa bir gecikmeyle belirir. Hero ışığı yavaş bir nefes alma ritminde hareket eder. Menü geçişi masaüstünde 36, mobilde 24 farklı boyut/açıdaki kağıdı 1,25–1,95 sn boyunca yukarıdan aşağı döker; sayfalar tabanda kısa süre tutulup yavaşça kaybolarak bölümü açığa çıkarır. Bölüm kartları aşağıdan 18–24 px yükselerek görünür. Hover parlamaları 180–240 ms aralığında tutulur. Hareket azaltma tercihi açıkken kağıt yağmuru ve sürekli parlamalar kaldırılır.

### Typography System

Başlıklarda **Space Grotesk** ağırlıklı grotesk yapı; teknik etiketlerde ve form meta bilgilerinde **IBM Plex Mono** kullanılacak. Ağ bağlantısı yoksa `Arial`, `ui-sans-serif` ve `ui-monospace` geri dönüşleri devreye girecek. Başlıklar kısa, büyük ve sıkı aralıklı; gövde metni 16–18 px ve rahat satır yüksekliğinde olacak.

### Brand Essence

**Pozisyonlama:** Beta-1 Cauterizers, SCP evreninin en kapalı operasyonlarını topluluk disiplini ve dosya estetiğiyle tanıtan birim portalıdır.

**Kişilik:** Soğukkanlı, gizemli, operasyonel.

### Brand Voice

Başlıklar kısa ve emir kipine yakın; CTA’lar doğrudan; açıklamalar dosya diliyle ama yeni oyuncunun anlayacağı kadar açık olacak.

Örnek satırlar:

- “Erişim verildi. Dosyayı aç.”
- “Aramızda hain, olmayan bir personeldir.”

### Wordmark & Logo

Wordmark, varsayılan metin yerine dairesel Beta-1 sembolü ile iki satırlı bir kilitli dosya etiketi olarak kullanılacak: üstte `BETA-1`, altta daha küçük `CAUTERIZERS`. Arama sonucu bulunan Beta-1 sembolü yükleme ekranında ve site markasında referans görsel olarak kullanılacak; yazı markası görselin üzerine bindirilerek değil, ayrı CSS tipografiyle okunabilir tutulacak.

### Signature Brand Color

**Field green — `#a9d887`**. Bu renk logo çevresi, yükleme ilerlemesi ve site çapındaki saha/odak öğelerini sahiplenir; menü kendi ayrı kırmızı kimliğini korur.

## Varlıklar ve malzeme kısıtları

Kullanılacak görseller Beta-1 Cauterizers arması, kullanıcı tarafından sağlanan operator ekran görüntüsü ve patch/decal görselleridir. Görseller proje içindeki `public/assets` klasöründe tutulacak ve sayfalardan `/assets/<dosya>` yollarıyla çağrılacak; böylece aynı yol hem Node sunucusunda hem `dist` statik çıktısında çalışacak. Görseller sırasıyla marka, operasyon örneği ve birim rozeti işlevlerini taşıyacak. Görsel yüklenemezse kartlar bozulmayacak; CSS tabanlı koyu placeholder arka planı korunacak.

## Proje yapısı

```text
betaone/
├── app.config.ts             # Proje logosu metadata’sı
├── package.json              # Bağımlılıksız dev/start/check/build komutları
├── server.js                 # Statik sunucu, /api/applications ve /_healthz
├── Dockerfile                # WebDev server publication konteyneri
├── index.html                # Tek sayfa içerik ve formlar
├── styles.css                # Tasarım sistemi, responsive ve animasyonlar
├── script.js                 # Menü, ses, kağıt yağmuru, başvuru postu ve scroll reveal
├── plan.md                   # Bu uygulama ve tasarım planı
├── TODO.md                   # Kaynak gereksinimlerden türetilen outcome listesi
└── public/
    ├── manus-routes.json     # Rota manifesti: /
    └── assets/               # Beta-1 logo ve ilgili görseller
```

## Sunum ve yayınlama

Önizleme için uygulama `0.0.0.0:3000` üzerinde çalışacak ve WebDev Preview bu portu kullanacak. WebDev’in onaylanmış `server:true` özelliği Discord aktarımı için etkinleştirildi; `database:false` kalacak. Yayın yapılandırması `Dockerfile`, `/_healthz` ve `/api/*` sunucu yolları ile `/*` no-cache statik ön yüz fallback rotalarından oluşacak. `DISCORD_APPLICATIONS_WEBHOOK_URL` yalnızca korumalı secret olarak alınacak; kaynak koda veya loglara yazılmayacak. Kullanıcı yayınlama istemediğinden bu revizyonla public release başlatılmayacak.


## 2026-10-08 — Revizyon kararı

- Beta-1 görev anlatısı SCP Wiki’nin [Mobile Task Forces listesi](https://scp-wiki.wikidot.com/task-forces) ile uyumlu tutulacak: yüksek gizlilik, Vakıf personeli içine olası düşman sızması ve diğer Gruplara bilgi sızıntısı şüpheleri. Bu resmî kısa tanım Beta-1’i genel anomali temizliği birimi olarak tanımlamadığı için önceki o ima kaldırılacak.
- “Personel Kadrosu” bölümü, kullanıcının sağladığı sıra ve adlandırmayla “Yönetim Kadrosu” olacak: Birim Şefi Berke_9801; Saha Şefi Sadecetanjiro47; Saha Şefi Benpaigo. Her kart, SCP/Vakıf personel dosyası biçiminde profil bağlantılı bir kağıt penceresi açacak.
- Önceki Beta-1 logosu (Cauterizers dairesel arması) yükleme, marka ve dosya kartlarında korunacak; kullanıcı tarafından sağlanan Roblox asker görseli ana görselde kullanılacak.
- Menü geçişi kullanıcı düzeltmesiyle tek perde/kaplama olmaktan çıkarılıp 24–36 farklı kağıdın ayrı ayrı yukarıdan aşağı düşerek zemine konduğu animasyona çevrildi; animasyon azaltma tercihi yine saygı görecek.
- Koyu-grafit ve saha yeşili genel renk sistemi korunurken sol navigasyon çizgisi, numaraları, hover ve aktif öğe kırmızıya alındı.

## 2026-10-08 — Anlaşmalı sunucular ve Discord başvuruları

- Menüye kırmızı vurgulu “Anlaşmalı Sunucular” kategorisi eklenecek. Omega-45 “Street Samurai” ve Sternritter Gang “Düşman Gruplar” kartları kullanıcının verdiği Discord davetlerine bağlanacak.
- Önceki tam ekran kaplama hareketi kaldırıldı; 24–36 kağıt farklı gecikme, ebat ve dönüşle yukarıdan düşüp tabanda kısa süre duruyor, sonra kaybolup yeni bölümü açıyor.
- Formda “Daha önce görev yaptığın yerler?” zorunlu yanıtı eklenecek. Gönderimden önce başvuru sahibine yanıtların Discord kanalına gideceği ve kanal erişimi olan üyelerce görülebileceği açıkça bildirilecek.
- Discord kanalına aktarım için başvuru API’si, `DISCORD_APPLICATIONS_WEBHOOK_URL` değerindeki webhook’un channel ID’sini `1555688585317982218` ile çalışma zamanında doğrulayıp tam cevapları bir Discord embed’i içinde gönderir. Yanlış kanal eşleşmesinde mesaj gönderilmez; başvuru verileri kalıcı depoya/loglara yazılmaz.
- Kullanıcı, `server:true` özelliğinin tek yönlü olduğunu görerek etkinleştirilmesine onay verdi; managed database açılmayacak. Hook URL’si gizli giriş akışıyla alınacak.
