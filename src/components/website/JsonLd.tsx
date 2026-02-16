export default function JsonLd() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'イワサキ内装',
        image: 'https://iwasaki-naisou.com/iwasaki.png',
        '@id': 'https://iwasaki-naisou.com',
        url: 'https://iwasaki-naisou.com',
        telephone: '03-1234-5678', // 仮の電話番号
        address: {
            '@type': 'PostalAddress',
            streetAddress: '西新宿1-1-1', // 仮の住所
            addressLocality: '新宿区',
            addressRegion: '東京都',
            postalCode: '160-0023',
            addressCountry: 'JP',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: 35.6895, // 仮の座標
            longitude: 139.6917,
        },
        openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday'
            ],
            opens: '09:00',
            closes: '18:00',
        },
        priceRange: '¥¥',
        description: '東京都を中心に30年以上の実績。住宅・店舗・オフィスの内装工事、クロス張替え、床材施工、バリアフリー改修を手掛ける信頼の内装専門業者です。',
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    )
}
