'use client';

import Link from 'next/link';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Marathon {
  name: string;
  date: string; // ISO date format for filtering (e.g. "2024-09-22")
  location: string;
  distance: string;
  description: string;
  logo: string;
  token?: string; // optional field to hold the URL 
}

const marathonsData = [
  {
    name: 'Московский марафон',
    date: '2025-09-20',
    location: 'Москва, Россия',
    distance: '42.2 км (полный марафон)',
    description: 'Крупное спортивное событие в столице с богатой историей.',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0782xqRYhnlv3l9GSUSEUuLqp2A82aarEOQ&s',
    token: 'moscow',
  },
  {
    name: 'Санкт-Петербургский марафон',
    date: '2025-08-17',
    location: 'Санкт-Петербург, Россия',
    distance: '42.2 км (полный марафон)',
    description: 'Марафон по улицам культурной столицы с живописными маршрутами.',
    logo: 'https://ss.sport-express.ru/userfiles/materials/196/1968477/volga.jpg',
    token: 'saint-petersburg',
  },
  {
    name: 'Казанский марафон',
    date: '2025-05-12',
    location: 'Казань, Россия',
    distance: '42.2 км (полный марафон)',
    description: 'Знаковое событие, объединяющее традиции и современность Татарстана.',
    logo: 'https://img.geliophoto.com/kazan/00_kazan.jpg',
    token: "kazan",
  },
  {
    name: 'Сочинский марафон',
    date: '2025-09-15',
    location: 'Сочи, Россия',
    distance: '42.2 км (полный марафон)',
    description: 'Марафон на фоне прекрасного побережья Черного моря.',
    logo: 'https://cdn2.rsttur.ru/file/1593226557LKlD2.webp',
    token: "sochi",
  },
  {
    name: 'Владивостокский марафон',
    date: '2025-10-03',
    location: 'Владивосток, Россия',
    distance: '42.2 км (полный марафон)',
    description: 'Событие на Дальнем Востоке с захватывающим видом на залив.',
    logo: 'https://cdn.forumvostok.ru/upload/medialibrary/d09/d09a266b52d7ebac0915f0f395b7ae64.jpg?1578905562337416',
    token: "vladivostok",
  },
  {
    name: 'Екатеринбургский марафон',
    date: '2025-07-10',
    location: 'Екатеринбург, Россия',
    distance: '42.2 км (полный марафон)',
    description: 'Марафон в центре Урала, объединяющий спортсменов со всей страны.',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGRacBRdS4ihD-2eiYwkMqrRyf-mH4mqsNwg&s',
  },
  {
    name: 'Новосибирский марафон',
    date: '2025-06-07',
    location: 'Новосибирск, Россия',
    distance: '42.2 км (полный марафон)',
    description: 'Один из самых крупных марафонов Сибири с уникальной атмосферой.',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjVM0qsLLqwbtVlFN_MGlzPn5OaOL-kzC4HQ&s',
  },
  {
    name: 'Омский марафон (Сибирский международный)',
    date: '2025-08-24',
    location: 'Омск, Россия',
    distance: '42.2 км (полный марафон)',
    description: 'Международное событие, привлекающее бегунов из разных стран.',
    logo: 'https://img.geliophoto.com/omsk2020/04_omsk2020.jpg',
    token: 'omsk',
  },
  {
    name: 'Челябинский марафон',
    date: '2025-05-19',
    location: 'Челябинск, Россия',
    distance: '42.2 км (полный марафон)',
    description: 'Марафон с активной поддержкой местного сообщества в Челябинске.',
    logo: 'https://img-fotki.yandex.ru/get/6839/30348152.197/0_80d0d_8d5e86fd_orig',
  },
  {
    name: 'Нижегородский марафон',
    date: '2025-06-14',
    location: 'Нижний Новгород, Россия',
    distance: '42.2 км (полный марафон)',
    description: 'Маршрут через исторический центр Нижнего Новгорода.',
    logo: 'https://img.geliophoto.com/nnw/00_nnw.jpg',
  },
  {
    name: 'Самарский марафон',
    date: '2025-09-12',
    location: 'Самара, Россия',
    distance: '42.2 км (полный марафон)',
    description: 'Яркое спортивное событие на берегу реки Волги.',
    logo: 'https://porusski.me/wp-content/uploads/2020/04/%D0%BE%D0%B1%D0%BB%D0%BE%D0%B6%D0%BA%D0%B0-%D1%81%D0%B0%D0%BC%D0%B0%D1%80%D0%B0.jpg',
  },
  {
    name: 'Уфимский марафон',
    date: '2025-08-10',
    location: 'Уфа, Россия',
    distance: '42.2 км (полный марафон)',
    description: 'Марафон, отражающий колорит республики Башкортостан.',
    logo: 'https://cdn.tripster.ru/thumbs2/2427a866-49f3-11ee-8bba-4e7c85935a75.1220x600.jpeg',
  },
  {
    name: 'Красноярский марафон',
    date: '2025-07-22',
    location: 'Красноярск, Россия',
    distance: '42.2 км (полный марафон)',
    description: 'Марафон с живописными пейзажами центральной Сибири.',
    logo: 'https://dostop.ru/wp-content/uploads/2022/12/krasnoyarsk.jpg',
  },
  {
    name: 'Пермский марафон',
    date: '2025-08-30',
    location: 'Пермь, Россия',
    distance: '42.2 км (полный марафон)',
    description: 'Событие, объединяющее спортсменов в динамичном городе Перми.',
    logo: 'https://cdn.tripster.ru/thumbs2/38deaf5e-474e-11ee-99cc-528c19fed677.1220x600.jpeg',
  },
  {
    name: 'Иркутский марафон',
    date: '2025-07-15',
    location: 'Иркутск, Россия',
    distance: '42.2 км (полный марафон)',
    description: 'Марафон с видом на уникальную природу Байкала.',
    logo: 'https://cdn.tripster.ru/thumbs2/ff963ff0-e4aa-11ee-877f-7613fb7b1af0.1220x600.jpeg',
  },
];

const MarathonList = () => {
  // States for filters
  const [cityFilter, setCityFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Filter marathons based on city substring and date range
  const filteredMarathons = marathonsData.filter((m) => {
    // City filter – case insensitive search in location
    const cityMatch = cityFilter
      ? m.location.toLowerCase().includes(cityFilter.toLowerCase())
      : true;
    // Date filtering – compare if date falls between start and end (if provided)
    const marathonDate = new Date(m.date).getTime();
    const startMatch = startDate ? marathonDate >= new Date(startDate).getTime() : true;
    const endMatch = endDate ? marathonDate <= new Date(endDate).getTime() : true;
    return cityMatch && startMatch && endMatch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredMarathons.length / itemsPerPage);
  const paginatedMarathons = filteredMarathons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };


  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Список марафонов России</h1>

      {/* Filters */}
      <br/>
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <form className="row g-3">
            <div className="col-md-4">
              <label htmlFor="city" className="form-label">
                Город
              </label>
              <input
                type="text"
                id="city"
                className="form-control"
                placeholder="Введите название города..."
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="startDate" className="form-label">
                Начальная дата
              </label>
              <input
                type="date"
                id="startDate"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="endDate" className="form-label">
                Конечная дата
              </label>
              <input
                type="date"
                id="endDate"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="col-md-2 d-flex align-items-end">
              <button type="reset" className="btn btn-secondary w-100" onClick={() => {
                setCityFilter('');
                setStartDate('');
                setEndDate('');
              }}>
                Сбросить
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Marathon Cards */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {paginatedMarathons.map((m, idx) => (
          <div key={idx} className="col">
              <div className="card h-100 shadow-sm" style={{ cursor: 'pointer' }}>
                <img
                  src={m.logo}
                  className="card-img-top p-3"
                  alt={`${m.name} logo`}
                  style={{ height: '250px', objectFit: 'contain' }}
                />
                <div className="card-body">
                  <h5 className="card-title">
                    <Link href={m.token ? `/marathons/${m.token}` : '#'} style={{ textDecoration: 'none', color: 'inherit' }}>
                      {m.name}
                    </Link>
                  </h5>
                  <p className="card-text">
                    <strong>Дата:</strong> {new Date(m.date).toLocaleDateString('ru-RU')}
                    <br />
                    <strong>Место:</strong> {m.location}
                    <br />
                    <strong>Дистанция:</strong> {m.distance}
                  </p>
                  <p className="card-text">{m.description}</p>
                    {m.token && (
                      <Link href={`/marathons/${m.token}`}>
                        <button className="btn btn-secondary">Подробнее о марафоне</button>
                      </Link>
                    )}
                </div>
              </div>
          </div>
        ))}
        {paginatedMarathons.length === 0 && (
          <div className="col-12">
            <div className="alert alert-warning text-center" role="alert">
              Марафоны не найдены по заданным фильтрам.
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      <nav aria-label="Pagination" className="mt-4">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Предыдущая
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <li
              key={page}
              className={`page-item ${currentPage === page ? 'active' : ''}`}
            >
              <button className="page-link" onClick={() => handlePageChange(page)}>
                {page}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Следующая
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default MarathonList;
