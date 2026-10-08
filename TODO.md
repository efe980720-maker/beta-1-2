# SCP | Beta-1 “Cauterizers” — TODO

- [x] Açılışta yüzde ilerlemesi gösteren yükleme ekranı; %100 olduğunda “Yükleniyor..” metni ve ardından ana sayfa
- [x] Koyu SCP teması, ışık/parlama efektleri ve sansürlü gizli bilgi blokları
- [x] Ana Sayfa, Yönetim Kadrosu, Anlaşmalı Sunucular, Başvuru Yap! ve Birimimizi daha yakından tanı bölümlerini içeren açılıp kapanabilir sol menü
- [x] Beta-1 bilgileri, eski Cauterizers logosu ve kullanıcının sağladığı operatör görseli
- [x] Site durumu Aktif, İnaktif veya Bakımda seçeneklerinden biri; başlangıç Aktif
- [x] Discord’a katıl butonunun https://discord.gg/w7Vt62RTU adresine yönlendirmesi
- [x] Ana başlık “Aramızda hain, olmayan bir personeldir.”
- [x] Beta-1 lore metni SCP Wiki görev tanımına (Vakıf personeline olası düşman sızması ve diğer Gruplara bilgi sızıntıları) uygun; kaynak bağlantısı mevcut
- [x] Yönetim Kadrosu sırası: Birim Şefi Berke_9801; Saha Şefi Sadecetanjiro47; Saha Şefi Benpaigo; her kart Vakıf kağıdı modalında ilgili Roblox hesabını gösterir
- [x] “Anlaşmalı Sunucular” kategorisi: Omega-45 “Street Samurai” bağlantısı https://discord.gg/hKWbNb7B4; “Düşman Gruplar / Sternritter Gang” bağlantısı https://discord.gg/vf9ZGR6QJ
- [x] Sol menü vurguları kırmızı; genel koyu tema korunuyor
- [x] Menü geçişi perde değil; masaüstünde 36, mobilde 24 farklı boyut ve dönüşte kağıdı yukarıdan aşağı düşürüp zeminde kısa süre tutuyor ve ardından bölümü açıyor
- [x] Başvuru formunda “Daha önce görev yaptığın yerler?” zorunlu sorusu var
- [x] Başvuru; Roblox adı, Discord adı, RP terimleri, Beta-1 bilgisi, daha önce görev yaptığı yerler, hesap yaşı ve günlük aktiflik yanıtlarını doğrulayıp `/api/applications` rotasına gönderiyor; Discord hedef webhook’u doğrulanınca tüm yedi yanıt Discord embed’inde iletiliyor
- [x] Form, cevapların hedef Discord kanalına gideceğini ve bu kanala erişimi olanların görebileceğini başvuru sahibine bildiriyor
- [x] Webhook URL’si korumalı secret alanında, kaynak/loglarda değil; hedefi yanlış webhook’ta başvuru iletimi reddediliyor; cevaplar veritabanı veya loglara yazılmıyor
- [ ] Gizli webhook’un hedefi olan 1555688585317982218 kanalını canlı salt-okunur Discord isteğiyle doğrulama. Korunan anahtar tanımlı olsa da çalışma zamanı değeriyle geçerli Discord hedefi doğrulanamadı; gerçek kanala sahte başvuru/test mesajı gönderilmedi.
- [x] Günlük aktiflik seçenekleri yalnızca 1-2, 2-3 ve 4+
- [x] Kullanıcı onayıyla `server:true` açıldı; managed database açılmadı; Dockerfile, health endpoint ve API/statik rotalar yapılandırıldı

- [x] Sunucu yalnızca izin verilen HTML/CSS/JS ve public varlıkları sunuyor; `/server.js`, `/package.json`, `/plan.md`, `/TODO.md` ve `Dockerfile` web istekleriyle açılmıyor
- [x] Site görselleri `public/assets` üzerinden aynı `/assets/...` yollarını kullanıyor; hem Node Preview hem `dist` statik çıktı içinde dosyalar mevcut
