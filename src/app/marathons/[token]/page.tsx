'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Map as OLMap, View, Overlay } from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import "ol/ol.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Carousel } from "react-bootstrap"; // Import Bootstrap Carousel

// Define interfaces for data
export interface Detail {
  label: string;
  value: string;
}

export interface Accommodation {
  name: string;
  distance: number; // km from start
  budget: string;
  coordinates: [number, number];
}

export interface Restaurant {
  name: string;
  distance: number; // km from start
  budget: string;
  coordinates: [number, number];
}

export interface Attraction {
  name: string;
  description: string;
  coordinates: [number, number];
}

export interface Marathon {
  token: string;
  name: string;
  date: string; // ISO date string
  location: string;
  distance: string;
  description: string;
  details: Detail[];
  accommodations: Accommodation[];
  restaurants: Restaurant[];
  attractions: Attraction[];
  mapCenter: [number, number]; // [lon, lat]
  images?: string[];
}

// Marker Icons
const icons = {
  hotel: 'https://cdn-icons-png.flaticon.com/512/1668/1668966.png',
  restaurant: 'https://img.icons8.com/color/48/000000/restaurant.png',
  attraction: 'https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/map-marker-icon.png',
};

// Function to create markers
const createMarker = (
  coords: [number, number],
  id: string,
  name: string,
  address: string,
  distance: string | null,
  type: 'hotel' | 'restaurant' | 'attraction',
  vectorSource: VectorSource
) => {
  const iconScale = type === 'hotel' ? 0.06 : type === 'attraction' ? 0.04 : 0.7; // Smaller scale for hotels and attractions
  const feature = new Feature({
    geometry: new Point(fromLonLat(coords)),
  });

  feature.setId(id);
  feature.setStyle(
    new Style({
      image: new Icon({
        src: icons[type],
        scale: iconScale,
      }),
    })
  );

  vectorSource.addFeature(feature);

  return { feature, info: { name, address, distance } };
};

// data for 6 marathons.
const marathonData = [
  {
    token: "moscow",
    name: "Московский марафон",
    date: "2025-09-20",
    location: "Москва, Россия",
    distance: "42.2 км (полный марафон)",
    description:
      "Московский марафон – крупнейший марафон в России, проходящий по историческим улицам города, включая Красную площадь. Участников ждет захватывающее приключение и поддержка зрителей.",
    details: [
      { label: "Трассы", value: "Городские улицы, парки, исторические кварталы" },
      { label: "Дистанции", value: "5 км, 10 км, полумарафон, марафон (42.2 км)" },
      { label: "Рекорды", value: "Мужчины: 2:10:00, Женщины: 2:30:00" },
      { label: "Количество участников", value: "Более 30 000" },
      { label: "Как добраться", value: "Метро, автобусы, такси" },
    ],
    accommodations: [
      { name: "Отель Москва Центр", distance: 0.5, budget: "средний", coordinates: [37.6044, 55.7652], address: "ул. Тверская, 5", website: "https://moscowcenterhotel.ru" },
      { name: "Гостиница Империя", distance: 0.8, budget: "премиум", coordinates: [37.5875, 55.7520], address: "ул. Арбат, 10", website: "https://imperiahotel.ru" },
      { name: "Отель Парк Отель", distance: 1.0, budget: "средний", coordinates: [37.6083, 55.7500], address: "ул. Знаменка, 15", website: "https://parkhotel.ru" },
      { name: "Отель Редиссон", distance: 1.5, budget: "премиум", coordinates: [37.5827, 55.7522], address: "ул. Новый Арбат, 31", website: "https://radisson.ru" },
      { name: "Отель Метрополь", distance: 0.7, budget: "средний", coordinates: [37.6216, 55.7598], address: "Театральная площадь, 1", website: "https://metropol.ru" },
    ],
    restaurants: [
      { name: "Кафе на Арбате", distance: 1.2, budget: "эконом", coordinates: [37.6010, 55.7520], address: "ул. Арбат, 15", website: "https://arbatcafe.ru" },
      { name: "Ресторан «Москва»", distance: 1.0, budget: "средний", coordinates: [37.6100, 55.7580], address: "ул. Новый Арбат, 25", website: "https://moscowrestaurant.ru" },
      { name: "Шикарный ресторан", distance: 0.9, budget: "премиум", coordinates: [37.6150, 55.7600], address: "ул. Тверская, 8", website: "https://luxurydining.ru" },
      { name: "Ресторан Боско", distance: 1.3, budget: "средний", coordinates: [37.6200, 55.7530], address: "Красная площадь, 3", website: "https://boscorestaurant.ru" },
      { name: "Кафе Пушкин", distance: 0.7, budget: "премиум", coordinates: [37.6070, 55.7600], address: "ул. Тверская, 26", website: "https://cafepushkin.ru" },
    ],
    attractions: [
      { name: "Красная площадь", description: "Знаменитая площадь Москвы.", coordinates: [37.6208, 55.7539], address: "Красная площадь", website: "https://kremlin.ru" },
      { name: "ГУМ", description: "Исторический торговый комплекс.", coordinates: [37.6216, 55.7549], address: "Красная площадь, 3", website: "https://gum.ru" },
      { name: "Парк Горького", description: "Популярное место для отдыха и прогулок.", coordinates: [37.6034, 55.7294], address: "ул. Крымский Вал, 9", website: "https://park-gorkogo.ru" },
      { name: "Собор Василия Блаженного", description: "Символ Москвы.", coordinates: [37.6231, 55.7525], address: "Красная площадь, 2", website: "https://saintbasil.ru" },
      { name: "Московский зоопарк", description: "Крупный зоопарк с редкими животными.", coordinates: [37.5733, 55.7602], address: "ул. Большая Грузинская, 1", website: "https://moscowzoo.ru" },
    ],
    mapCenter: [37.618423, 55.751244],
    images: [
      "https://media.cnn.com/api/v1/images/stellar/prod/180531144547-03-moscow-attractions-st-basils-cathedral.jpg?q=w_5381,h_3027,x_0,y_0,c_fill",
      "https://www.minib.cz/upItems/imgs/005/moskau_city_54003aee_75b5_4882_99ac_c54c602eadf6_xl.jpg",
      "https://images.squarespace-cdn.com/content/v1/57b9b98a29687f1ef5c622df/1486569993859-HT5WX1Z30ISW0Q5U1ZDG/state+historical+museum+moscow",
      "https://lp-cms-production.imgix.net/2024-09/Moscow-Red-Square-9a8e66e06b49.jpg?fit=crop&w=3840&auto=format&q=75",
    ],
  },
  {
    token: "omsk",
    name: "Омский марафон (Сибирский международный)",
    date: "2025-08-24",
    location: "Омск, Россия",
    distance: "42.2 км (полный марафон)",
    description:
      "Омский марафон – международное событие, привлекающее бегунов со всего мира, проходящее по живописному маршруту города.",
    details: [
      { label: "Трассы", value: "Улицы Омска, парки" },
      { label: "Дистанции", value: "Полумарафон, марафон" },
      { label: "Рекорды", value: "Мужчины: 2:20:00, Женщины: 2:40:00" },
      { label: "Количество участников", value: "Около 15 000" },
      { label: "Как добраться", value: "Автобусы, такси, электричка" },
    ],
    accommodations: [
      { name: "Отель Омск Центр", distance: 0.4, budget: "средний", coordinates: [73.3686, 54.9893], address: "ул. Ленина, 5", website: "https://omskcenterhotel.ru" },
      { name: "Гостиница Сибирь", distance: 0.7, budget: "премиум", coordinates: [73.3700, 54.9900], address: "ул. Фрунзе, 20", website: "https://siberiahotel.ru" },
      { name: "Отель Сибирь", distance: 1.0, budget: "средний", coordinates: [73.3720, 54.9870], address: "ул. Карла Маркса, 15", website: "https://siberiahotel.ru" },
      { name: "Гостиница Заря", distance: 1.2, budget: "эконом", coordinates: [73.3750, 54.9850], address: "ул. Победы, 10", website: "https://zaryahotel.ru" },
      { name: "Отель Виктория", distance: 0.8, budget: "средний", coordinates: [73.3740, 54.9860], address: "ул. Комсомольская, 8", website: "https://victoriahotel.ru" },
    ],
    restaurants: [
      { name: "Ресторан Сибирь", distance: 0.7, budget: "средний", coordinates: [73.3700, 54.9900], address: "ул. Фрунзе, 25", website: "https://sibrestaurant.ru" },
      { name: "Кафе Омск", distance: 0.5, budget: "эконом", coordinates: [73.3680, 54.9880], address: "ул. Ленина, 10", website: "https://omskcafe.ru" },
      { name: "Гастроном Омска", distance: 1.0, budget: "премиум", coordinates: [73.3720, 54.9870], address: "ул. Ленина, 15", website: "https://gastronomyomsk.ru" },
      { name: "Кафе Ласточка", distance: 0.8, budget: "средний", coordinates: [73.3740, 54.9860], address: "ул. Карла Маркса, 8", website: "https://lastochkacafe.ru" },
      { name: "Ресторан Омский Уют", distance: 0.6, budget: "средний", coordinates: [73.3750, 54.9850], address: "ул. Победы, 12", website: "https://omskuiut.ru" },
    ],
    attractions: [
      { name: "Омский художественный музей", description: "Известный музей Омска.", coordinates: [73.3680, 54.9880], address: "ул. Ленина, 3", website: "https://omskartmuseum.ru" },
      { name: "Старый город", description: "Историческая часть города.", coordinates: [73.3670, 54.9870], address: "ул. Победы, 1", website: "https://omskoldtown.ru" },
      { name: "Парк Победы", description: "Большой парк для отдыха.", coordinates: [73.3690, 54.9860], address: "ул. Карла Маркса, 12", website: "https://victoryparkomsk.ru" },
      { name: "Омская крепость", description: "Историческая крепость Омска.", coordinates: [73.3710, 54.9900], address: "ул. Фрунзе, 30", website: "https://omskfortress.ru" },
      { name: "Омский театр драмы", description: "Красивый театр с богатой историей.", coordinates: [73.3730, 54.9880], address: "ул. Карла Либкнехта, 20", website: "https://omskdramatheatre.ru" },
    ],
    mapCenter: [73.3686, 54.9893],
    images: [
      "https://img-fotki.yandex.ru/get/6104/30348152.124/0_600ee_429abb88_orig",
      "https://img.geliophoto.com/omsk2020/04_omsk2020.jpg",
      "https://apelsin-tur.ru/wp-content/uploads/2021/02/omsk-lyubinsky-prospekt.jpg",
      "https://click-or-die.ru/app/uploads/2017/08/Omsk.-Rechnoy-vokzal.jpg",
    ],
  },
  {
    token: "saint-petersburg",
    name: "Санкт-Петербургский марафон",
    date: "2025-08-17",
    location: "Санкт-Петербург, Россия",
    distance: "42.2 км (полный марафон)",
    description:
      "Санкт-Петербургский марафон проходит по улицам культурной столицы, демонстрируя историческую архитектуру и живописные виды. Участники бегут по маршруту, который объединяет классические и современные локации города.",
    details: [
      { label: "Трассы", value: "Реки, мосты, исторические улицы" },
      { label: "Дистанции", value: "5 км, 10 км, полумарафон, марафон" },
      { label: "Рекорды", value: "Мужчины: 2:12:00, Женщины: 2:32:00" },
      { label: "Количество участников", value: "Более 25 000" },
      { label: "Как добраться", value: "Метро, автобусы, такси" },
    ],
    accommodations: [
      { name: "Отель Петербург", distance: 0.6, budget: "средний", coordinates: [30.3470, 59.9325], address: "Невский проспект, 12", website: "https://peterhotel.ru" },
      { name: "Гостиница Дворцовая", distance: 1.0, budget: "премиум", coordinates: [30.3150, 59.9400], address: "Дворцовая площадь, 5", website: "https://palacehotel.ru" },
      { name: "Отель Спутник", distance: 0.8, budget: "средний", coordinates: [30.3600, 59.9390], address: "ул. Литейный, 20", website: "https://sputnikhotel.ru" },
      { name: "Гостиница Россия", distance: 1.2, budget: "эконом", coordinates: [30.3200, 59.9270], address: "ул. Гороховая, 8", website: "https://russiahotel.ru" },
      { name: "Отель Ривьера", distance: 0.5, budget: "средний", coordinates: [30.3100, 59.9350], address: "ул. Малая Морская, 10", website: "https://rivierahotel.ru" },
    ],
    restaurants: [
      { name: "Кафе Пушкин", distance: 0.8, budget: "средний", coordinates: [30.3141, 59.9386], address: "ул. Невский, 18", website: "https://pushkincafe.ru" },
      { name: "Ресторан Дворцовая", distance: 0.5, budget: "премиум", coordinates: [30.3200, 59.9350], address: "ул. Миллионная, 2", website: "https://palacerestaurant.ru" },
      { name: "Уютное кафе", distance: 1.0, budget: "эконом", coordinates: [30.3250, 59.9330], address: "ул. Фонтанки, 15", website: "https://cosycafe.ru" },
      { name: "Ресторан Северная звезда", distance: 0.7, budget: "средний", coordinates: [30.3300, 59.9340], address: "ул. Гороховая, 12", website: "https://northstarrestaurant.ru" },
      { name: "Кафе Гавань", distance: 0.9, budget: "средний", coordinates: [30.3150, 59.9370], address: "ул. Морская, 8", website: "https://harborcafe.ru" },
    ],
    attractions: [
      { name: "Дворцовая площадь", description: "Главная площадь Санкт-Петербурга.", coordinates: [30.3146, 59.9398], address: "Дворцовая площадь", website: "https://palacesquare.ru" },
      { name: "Эрмитаж", description: "Один из крупнейших музеев мира.", coordinates: [30.3130, 59.9405], address: "Дворцовая набережная, 34", website: "https://hermitage.ru" },
      { name: "Невский проспект", description: "Знаменитая улица с исторической архитектурой.", coordinates: [30.3558, 59.9311], address: "Невский проспект", website: "https://nevsky.ru" },
      { name: "Исаакиевский собор", description: "Крупный собор в центре города.", coordinates: [30.3060, 59.9343], address: "Исаакиевская площадь, 4", website: "https://isaacscathedral.ru" },
      { name: "Мариинский театр", description: "Один из самых известных театров.", coordinates: [30.2960, 59.9256], address: "Театральная площадь, 1", website: "https://mariinsky.ru" },
    ],
    mapCenter: [30.3609, 59.9311],
    images: [
      "https://sokroma.ru/upload/resize_cache/webp/iblock/a32/8kwc1yej314rkkzlslt614nsrwk8iwrp.webp",
      "https://cdn.tripster.ru/thumbs2/46a99286-aab0-11ef-a1a7-72c411f6db16.1220x600.jpeg",
      "https://cdn2.tu-tu.ru/image/pagetree_node_data/1/d54c7a90618dad430f90f15b1092d902/",
    ],
  },
  {
    token: "kazan",
    name: "Казанский марафон",
    date: "2025-05-12",
    location: "Казань, Россия",
    distance: "42.2 км (полный марафон)",
    description:
      "Казанский марафон проходит в центре Казани, охватывая исторические места города, включая знаменитый Кремль. Это событие ежегодно привлекает тысячи участников.",
    details: [
      { label: "Трассы", value: "Исторические улицы, парки" },
      { label: "Дистанции", value: "5 км, 10 км, полумарафон, марафон" },
      { label: "Рекорды", value: "Мужчины: 2:14:00, Женщины: 2:33:00" },
      { label: "Количество участников", value: "Более 15 000" },
      { label: "Как добраться", value: "Метро, автобусы, такси" },
    ],
    accommodations: [
      { name: "Отель Казань Центр", distance: 0.5, budget: "средний", coordinates: [49.1221, 55.7887], address: "ул. Баумана, 5", website: "https://kazancenterhotel.ru" },
      { name: "Гостиница Кремль", distance: 0.7, budget: "премиум", coordinates: [49.1240, 55.7890], address: "ул. Кремлевская, 12", website: "https://kazan-kremlin.ru" },
      { name: "Отель Татарстан", distance: 1.2, budget: "эконом", coordinates: [49.1220, 55.7910], address: "ул. Татарстанская, 8", website: "https://tatarthotel.ru" },
      { name: "Гранд Отель Казань", distance: 1.0, budget: "средний", coordinates: [49.1190, 55.7880], address: "ул. Петербургская, 35", website: "https://grandkazan.ru" },
      { name: "Отель Мираж", distance: 0.9, budget: "премиум", coordinates: [49.1250, 55.7920], address: "ул. Ямашева, 3", website: "https://miragehotel.ru" },
    ],
    restaurants: [
      { name: "Ресторан Тюбетей", distance: 0.8, budget: "средний", coordinates: [49.1200, 55.7900], address: "ул. Баумана, 10", website: "https://tubetei.ru" },
      { name: "Кафе Кремль", distance: 0.6, budget: "эконом", coordinates: [49.1240, 55.7890], address: "ул. Кремлевская, 15", website: "https://kremlcafe.ru" },
      { name: "Гастроном Татарии", distance: 1.0, budget: "премиум", coordinates: [49.1220, 55.7910], address: "ул. Татарстанская, 4", website: "https://tatarcuisine.ru" },
      { name: "Кафе Чак-чак", distance: 0.9, budget: "средний", coordinates: [49.1190, 55.7880], address: "ул. Петербургская, 22", website: "https://chakchakcafe.ru" },
      { name: "Ресторан Волга", distance: 1.1, budget: "средний", coordinates: [49.1250, 55.7920], address: "ул. Кремлевская, 19", website: "https://volgarest.ru" },
    ],
    attractions: [
      { name: "Казанский Кремль", description: "Историческая крепость Казани.", coordinates: [49.1239, 55.7972], address: "ул. Кремлевская, 1", website: "https://kazankremlin.ru" },
      { name: "Мечеть Кул Шариф", description: "Знаменитая мечеть в Кремле.", coordinates: [49.1245, 55.7981], address: "ул. Кремлевская, 2", website: "https://kulsharif.ru" },
      { name: "Улица Баумана", description: "Пешеходная улица с кафе и магазинами.", coordinates: [49.1221, 55.7887], address: "ул. Баумана", website: "https://baumana.ru" },
      { name: "Центр семьи Казан", description: "Здание в виде чаша, с видом на Волгу.", coordinates: [49.1068, 55.8304], address: "ул. Сибгата Хакима, 4", website: "https://kazanfamilycenter.ru" },
      { name: "Парк Черное озеро", description: "Зеленый парк для прогулок.", coordinates: [49.1225, 55.7875], address: "ул. Лобачевского, 12", website: "https://blacklakepark.ru" },
    ],
    mapCenter: [49.1221, 55.7887],
    images: [
      "https://kuda-kazan.ru/uploads/e413f03713d1a6eebf20c7bc7ccd9816.jpg",
      "https://kuda-kazan.ru/uploads/7f1cb0741d05ff952d46f06a1c635310.jpg",
      "https://7d9e88a8-f178-4098-bea5-48d960920605.selcdn.net/f03d4b3c-9615-48fd-affd-ed5ad2731a6a/-/format/auto/-/quality/smart_retina/-/stretch/off/-/resize/1900x/",
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/4d/45/da/kazan.jpg?w=1200&h=700&s=1",
    ],
  },
  {
    token: "sochi",
    name: "Сочинский марафон",
    date: "2025-09-15",
    location: "Сочи, Россия",
    distance: "42.2 км (полный марафон)",
    description:
      "Сочинский марафон проходит вдоль Черного моря, обеспечивая потрясающие виды. Забег включает пляжные улицы и центральные районы города.",
    details: [
      { label: "Трассы", value: "Пляжные дороги, центральные улицы" },
      { label: "Дистанции", value: "5 км, 10 км, полумарафон, марафон" },
      { label: "Рекорды", value: "Мужчины: 2:16:00, Женщины: 2:36:00" },
      { label: "Количество участников", value: "Более 20 000" },
      { label: "Как добраться", value: "Автобусы, такси, электробусы" },
    ],
    accommodations: [
      { name: "Отель Сочи Центр", distance: 0.7, budget: "средний", coordinates: [39.7200, 43.5850], address: "ул. Курортный проспект, 15", website: "https://sochicenterhotel.ru" },
      { name: "Гостиница Олимпийская", distance: 1.0, budget: "премиум", coordinates: [39.9550, 43.4050], address: "ул. Олимпийская, 22", website: "https://olympicsochi.ru" },
      { name: "Отель Звезда", distance: 0.6, budget: "эконом", coordinates: [39.7100, 43.5800], address: "ул. Ленина, 10", website: "https://zvezdahotel.ru" },
      { name: "Гранд Отель Сочи", distance: 1.1, budget: "премиум", coordinates: [39.7250, 43.5750], address: "ул. Победы, 8", website: "https://grandsochi.ru" },
      { name: "Отель Морской", distance: 0.8, budget: "средний", coordinates: [39.7300, 43.5700], address: "ул. Морская, 20", website: "https://morskoihotel.ru" },
    ],
    restaurants: [
      { name: "Ресторан Черноморье", distance: 1.2, budget: "средний", coordinates: [39.7130, 43.6020], address: "ул. Морская, 14", website: "https://chernomorierest.ru" },
      { name: "Кафе Пляж", distance: 1.0, budget: "эконом", coordinates: [39.7150, 43.6000], address: "ул. Победы, 6", website: "https://beachcafe.ru" },
      { name: "Гастроном Сочи", distance: 1.3, budget: "премиум", coordinates: [39.7100, 43.6030], address: "ул. Ленина, 12", website: "https://sochigastronomy.ru" },
      { name: "Ресторан Ривьера", distance: 0.9, budget: "средний", coordinates: [39.7120, 43.6010], address: "ул. Ривьера, 4", website: "https://rivierarest.ru" },
      { name: "Кафе Олимпия", distance: 1.1, budget: "средний", coordinates: [39.7140, 43.5990], address: "ул. Олимпийская, 18", website: "https://olympiacafe.ru" },
    ],
    attractions: [
      { name: "Парк Ривьера", description: "Популярный парк для отдыха.", coordinates: [39.7250, 43.5900], address: "ул. Ривьера, 1", website: "https://riviera.ru" },
      { name: "Сочинский дендрарий", description: "Ботанический сад с уникальными растениями.", coordinates: [39.7400, 43.5730], address: "ул. Курортный пр., 74", website: "https://sochidendr.ru" },
      { name: "Зимний театр", description: "Театр в центре города.", coordinates: [39.7280, 43.5735], address: "ул. Театральная, 2", website: "https://wintertheater.ru" },
      { name: "Морской порт Сочи", description: "Главный порт города.", coordinates: [39.7200, 43.5780], address: "ул. Морской, 2", website: "https://sochiport.ru" },
      { name: "Олимпийский парк", description: "Комплекс сооружений Олимпиады.", coordinates: [39.9550, 43.4020], address: "ул. Олимпийская, 1", website: "https://olympicsochi.ru" },
    ],
    mapCenter: [39.7138, 43.6026],
    images: [
      "https://7d9e88a8-f178-4098-bea5-48d960920605.selcdn.net/493da04c-3a2b-402d-8557-a90f3f4b867b/-/format/auto/-/quality/smart_retina/-/stretch/off/-/resize/1900x/",
      "https://sochi.ru/upload/medialibrary/347/34788aa79c16c18530b1d98ad51b1dc1.jpg",
      "https://ridertrip.ru/wp-content/uploads/2020/08/dji_0133.jpg",
    ],
  },
  {
    token: "vladivostok",
    name: "Владивостокский марафон",
    date: "2025-10-03",
    location: "Владивосток, Россия",
    distance: "42.2 км (полный марафон)",
    description:
      "Владивостокский марафон проходит вдоль живописного залива, соединяя современные улицы города с историческими местами. Это уникальное событие привлекает бегунов со всего мира.",
    details: [
      { label: "Трассы", value: "Прибрежные дороги, мосты, исторические улицы" },
      { label: "Дистанции", value: "5 км, 10 км, полумарафон, марафон" },
      { label: "Рекорды", value: "Мужчины: 2:18:00, Женщины: 2:38:00" },
      { label: "Количество участников", value: "Более 12 000" },
      { label: "Как добраться", value: "Автобусы, такси, электричка" },
    ],
    accommodations: [
      { name: "Отель Владивосток Центр", distance: 0.6, budget: "средний", coordinates: [131.8850, 43.1150], address: "ул. Светланская, 10", website: "https://vladcenterhotel.ru" },
      { name: "Гостиница Приморье", distance: 1.0, budget: "премиум", coordinates: [131.8860, 43.1160], address: "ул. Океанский проспект, 20", website: "https://primoryehotel.ru" },
      { name: "Отель Амурский залив", distance: 0.8, budget: "эконом", coordinates: [131.8840, 43.1130], address: "ул. Калинина, 5", website: "https://amurbayhotel.ru" },
      { name: "Гранд Отель Владивосток", distance: 1.2, budget: "премиум", coordinates: [131.8870, 43.1170], address: "ул. Алеутская, 22", website: "https://grandvladivostok.ru" },
      { name: "Отель Тихий Океан", distance: 0.9, budget: "средний", coordinates: [131.8830, 43.1140], address: "ул. Набережная, 15", website: "https://pacifichotel.ru" },
    ],
    restaurants: [
      { name: "Ресторан Океан", distance: 1.3, budget: "средний", coordinates: [131.8860, 43.1155], address: "ул. Океанский проспект, 12", website: "https://oceanrest.ru" },
      { name: "Кафе Приморье", distance: 1.0, budget: "эконом", coordinates: [131.8880, 43.1145], address: "ул. Светланская, 8", website: "https://primcafes.ru" },
      { name: "Гастроном Владивостока", distance: 1.2, budget: "премиум", coordinates: [131.8900, 43.1160], address: "ул. Алеутская, 25", website: "https://vladgastronomy.ru" },
      { name: "Ресторан Золотой Рог", distance: 0.9, budget: "средний", coordinates: [131.8840, 43.1130], address: "ул. Набережная, 5", website: "https://goldenhornrest.ru" },
      { name: "Кафе Тихий Океан", distance: 1.1, budget: "средний", coordinates: [131.8820, 43.1120], address: "ул. Калинина, 18", website: "https://pacificcafe.ru" },
    ],
    attractions: [
      { name: "Золотой мост", description: "Висячий мост через бухту Золотой Рог.", coordinates: [131.8860, 43.1155], address: "ул. Набережная, 1", website: "https://goldenbridge.ru" },
      { name: "Русский остров", description: "Живописный остров в заливе Петра Великого.", coordinates: [131.7280, 42.9690], address: "Русский остров", website: "https://russkyisland.ru" },
      { name: "Владивостокская крепость", description: "Историческая оборонительная крепость.", coordinates: [131.8735, 43.1050], address: "ул. Фортовая, 3", website: "https://vladfortress.ru" },
      { name: "Набережная Спортивная", description: "Популярное место для прогулок и отдыха.", coordinates: [131.8850, 43.1160], address: "ул. Набережная, 7", website: "https://sportembankment.ru" },
      { name: "Маяк Токаревского", description: "Один из самых известных маяков России.", coordinates: [131.8650, 43.0980], address: "Маяк Токаревского", website: "https://tokarevskylighthouse.ru" },
    ],
    mapCenter: [131.8853, 43.1155],
    images: [
      "https://cdn.forumvostok.ru/upload/medialibrary/d09/d09a266b52d7ebac0915f0f395b7ae64.jpg?1578905562337416",
      "https://breeze.ru/files/images/port_vladivostok_0.jpg",
      "https://cdn.iz.ru/sites/default/files/styles/1065xh/public/photo_item-2022-06/1.jpg?itok=inpDBYqp",
    ],
  },
];

export default function MarathonDetailPage({ params }: { params: { token: string } }) {
  const marathon = marathonData.find((m) => m.token === params.token) || null;

  if (!marathon) {
    return (
      <div className="container my-5">
        <Link href="/marathons">
          <button className="btn btn-secondary mb-4">&larr; Вернуться к списку марафонов</button>
        </Link>
        <h1 className="text-center">Марафон не найден.</h1>
      </div>
    );
  }

  // --- Map Setup ---
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstance = useRef<OLMap | null>(null);
    const popupRef = useRef<HTMLDivElement | null>(null);
    const overlayRef = useRef<Overlay | null>(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
  
    useEffect(() => {
      if (!mapRef.current || mapInstance.current) return;
  
      // Initialize OpenLayers Map
      mapInstance.current = new OLMap({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: fromLonLat(marathon.mapCenter),
          zoom: 12,
        }),
      });
  
      // Vector Source for Markers
      const vectorSource = new VectorSource();
      const markerLayer = new VectorLayer({ source: vectorSource });
      mapInstance.current.addLayer(markerLayer);
  
      // Hotels, Restaurants, Attractions markers
      const markerMap = new Map();
  
      marathon.accommodations.forEach((hotel) => {
        if (hotel.coordinates) {
          const marker = createMarker(
            hotel.coordinates as [number, number],
            `hotel-${hotel.name}`,
            hotel.name,
            hotel.address,
            `${hotel.distance} км`,
            'hotel',
            vectorSource
          );
          markerMap.set(marker.feature.getId(), marker.info);
        }
      });
  
      marathon.restaurants.forEach((restaurant) => {
        if (restaurant.coordinates) {
          const marker = createMarker(
            restaurant.coordinates as [number, number],
            `restaurant-${restaurant.name}`,
            restaurant.name,
            restaurant.address,
            `${restaurant.distance} км`,
            'restaurant',
            vectorSource
          );
          markerMap.set(marker.feature.getId(), marker.info);
        }
      });
  
      marathon.attractions.forEach((attraction) => {
        if (attraction.coordinates) {
          const marker = createMarker(
            attraction.coordinates as [number, number],
            `attraction-${attraction.name}`,
            attraction.name,
            attraction.address,
            null,
            'attraction',
            vectorSource
          );
          markerMap.set(marker.feature.getId(), marker.info);
        }
      });
  
      // Popup overlay
      overlayRef.current = new Overlay({
        element: popupRef.current!,
        positioning: 'bottom-center',
        stopEvent: false,
      });
      mapInstance.current.addOverlay(overlayRef.current);
  
      // Click listener for markers
      mapInstance.current.on('click', (event) => {
        const clickedFeature = mapInstance.current!.forEachFeatureAtPixel(event.pixel, (feat) => feat);
        if (clickedFeature) {
          const info = markerMap.get(clickedFeature.getId());
          if (info) {
            overlayRef.current?.setPosition(event.coordinate);
            if (popupRef.current) {
              popupRef.current.innerHTML = `
                <b>${info.name}</b> <br />
                📍 адрес: ${info.address} <br />
                ${info.distance ? `📏 расстояние до старта: ${info.distance}` : ''}
              `;
              popupRef.current.style.display = 'block';
            }
          }
        } else {
          if (popupRef.current) popupRef.current.style.display = 'none';
        }
      });
  
      setIsMapLoaded(true);
    }, [marathon]);

  return (
    <div className="container my-5">
      <Link href="/marathons">
        <button className="btn btn-secondary mb-4">&larr; Вернуться к списку марафонов</button>
      </Link>
      <h1 className="text-center mb-4">{marathon.name}</h1>

      {/* Optional Carousel */}
      {marathon.images && marathon.images.length > 0 && (
        <Carousel className="mb-4">
          {marathon.images.map((image, idx) => (
            <Carousel.Item key={idx}>
              <img
                className="d-block w-100"
                src={image}
                alt={`Slide ${idx + 1}`}
                style={{ borderRadius: "10px", maxHeight: "800px", objectFit: "cover" }}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      )}      

      {/* Section 1: Marathon Description and Details */}
      <section className="mb-5">
        <h3>Описание марафона</h3>
        <p>{marathon.description}</p>
        <ul>
          <li>
            <strong>Дата:</strong>{" "}
            {new Date(marathon.date).toLocaleDateString("ru-RU")}
          </li>
          <li>
            <strong>Место:</strong> {marathon.location}
          </li>
          <li>
            <strong>Дистанция:</strong> {marathon.distance}
          </li>
          {marathon.details.map((detail, idx) => (
            <li key={idx}>
              <strong>{detail.label}:</strong> {detail.value}
            </li>
          ))}
        </ul>
      </section>

      {/* Section 2: Nearby Accommodations */}
      <section className="mb-5">
        <h3>Места размещения рядом со стартом</h3>
        <p>
          Ниже приведён список отелей, гостиниц, кафе и ресторанов, расположенных вблизи старта марафона.
          Выберите вариант, исходя из расстояния до старта и вашего бюджета.
        </p>
        <div className="row">
          {marathon.accommodations.map((item, idx) => (
            <div key={idx} className="col-md-4 mb-3">
              <div className="card p-3">
                <h5>{item.name}</h5>
                <p>
                  <strong>Адрес:</strong> {item.address}<br />
                  <strong>Расстояние до старта:</strong> {item.distance} км<br />
                  <strong>Бюджет:</strong> {item.budget}
                </p>
                  {item.website && (
                    <button
                    className="btn btn-secondary"
                    onClick={() => window.open(item.website, "_blank")}>
                      Перейти на сайт
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Restaurants */}
      <section className="mb-5">
        <h3>Рестораны рядом со стартом</h3>
        <p>
          Ниже приведён список ресторанов, где можно пообедать или перекусить перед марафоном.
        </p>
        <div className="row">
          {marathon.restaurants.map((item, idx) => (
            <div key={idx} className="col-md-4 mb-3">
              <div className="card p-3">
                <h5>{item.name}</h5>
                <p>
                  <strong>Адрес:</strong> {item.address}<br />
                  <strong>Расстояние до старта:</strong> {item.distance} км<br />
                  <strong>Бюджет:</strong> {item.budget}
                </p>
                  {item.website && (
                      <button
                      className="btn btn-secondary"
                      onClick={() => window.open(item.website, "_blank")}>
                      Перейти на сайт
                      </button>
                    )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: Attractions for Travelers */}
      <section className="mb-5">
        <h3>Интересные места для путешествий</h3>
        <p>
          Помимо марафонской трассы, город предлагает множество достопримечательностей.
          Ниже приведён список мест, которые стоит посетить.
        </p>
        <div className="row">
          {marathon.attractions.map((attr, idx) => (
            <div key={idx} className="col-md-4 mb-3">
              <div className="card p-3">
                <h5>{attr.name}</h5>
                <p>{attr.description}
                <br />
                <strong>Адрес:</strong> {attr.address}
                </p>
                {attr.website && (
                    <button
                    className="btn btn-secondary"
                    onClick={() => window.open(attr.website, "_blank")}>
                      Подробнее на сайте
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 5: Map Component */}
      <section className="mb-5">
        <h3>Карта</h3>
        <div
          ref={mapRef}
          style={{
            width: "100%",
            height: "500px",
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
          }}
        />
        <div
          ref={popupRef}
          style={{
            display: "none",
            position: "absolute",
            background: "white",
            padding: "10px",
            borderRadius: "5px",
            boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
            fontSize: "14px",
            textAlign: "center",
          }}
        />
      </section>
    </div>
  );
}
