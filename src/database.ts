import * as SQLite from 'expo-sqlite';
import { TouristSpot, Category, FacilityType } from './types';

let db: SQLite.SQLiteDatabase;
const seeds: Omit<TouristSpot,'id'>[] = [
 {name:'Lembah Harau',category:'Wisata Alam',address:'Nagari Tarantang, Kecamatan Harau, Kabupaten Lima Puluh Kota',description:'Lembah dengan tebing granit tinggi, hamparan sawah, dan panorama alam khas Sumatera Barat.',ticketPrice:15000,openingHours:'07.00–18.00',latitude:-0.1058,longitude:100.6748,facilities:['Toilet','Tempat Parkir','Tempat Makan']},
 {name:'Air Terjun Sarasah Bunta',category:'Wisata Alam',address:'Kawasan Resort Bunta, Tarantang, Kecamatan Harau',description:'Air terjun populer di kawasan Lembah Harau dengan area untuk menikmati suasana alam dan berfoto.',ticketPrice:10000,openingHours:'08.00–17.00',latitude:-0.1038,longitude:100.6730,facilities:['Toilet','Tempat Parkir','Tempat Makan']},
 {name:'Kampung Eropa Harau',category:'Wisata Rekreasi',address:'Jl. Lembah Harau, Tarantang, Kecamatan Harau',description:'Kawasan rekreasi tematik dengan bangunan bergaya Eropa dan spot foto keluarga.',ticketPrice:25000,openingHours:'09.00–18.00',latitude:-0.1014,longitude:100.6784,facilities:['Toilet','Tempat Parkir','Musala','Tempat Makan']},
 {name:'Panorama Lembah Harau',category:'Wisata Alam',address:'Tarantang, Kecamatan Harau, Kabupaten Lima Puluh Kota',description:'Titik singgah untuk menikmati bentang tebing, lembah hijau, dan lanskap persawahan.',ticketPrice:5000,openingHours:'07.00–18.00',latitude:-0.1045,longitude:100.6757,facilities:['Tempat Parkir','Tempat Makan']},
 {name:'Sarasah Donat',category:'Wisata Alam',address:'Tarantang, Kecamatan Harau, Kabupaten Lima Puluh Kota',description:'Air terjun alami di kawasan Harau yang dapat dikunjungi sebagai bagian dari jelajah lembah.',ticketPrice:10000,openingHours:'08.00–17.00',latitude:-0.1095,longitude:100.6800,facilities:['Toilet','Tempat Parkir']},
 {name:'Kawasan Harau Dream Park',category:'Wisata Rekreasi',address:'Kampuang Sarosah, Tarantang, Kecamatan Harau',description:'Kawasan wisata keluarga dengan beberapa zona tematik dan aktivitas rekreasi.',ticketPrice:20000,openingHours:'09.00–18.00',latitude:-0.1002,longitude:100.6796,facilities:['Toilet','Tempat Parkir','Musala','Tempat Makan','Pusat Informasi']}
];
export async function initDatabase(){
 db=await SQLite.openDatabaseAsync('sig_wisata_harau.db');
 await db.execAsync(`PRAGMA journal_mode = WAL;
 CREATE TABLE IF NOT EXISTS categories(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT UNIQUE NOT NULL);
 CREATE TABLE IF NOT EXISTS spots(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,category TEXT NOT NULL,address TEXT NOT NULL,description TEXT NOT NULL,ticketPrice INTEGER NOT NULL DEFAULT 0,openingHours TEXT NOT NULL,latitude REAL NOT NULL,longitude REAL NOT NULL);
 CREATE TABLE IF NOT EXISTS facilities(id INTEGER PRIMARY KEY AUTOINCREMENT,spotId INTEGER NOT NULL,type TEXT NOT NULL,FOREIGN KEY(spotId) REFERENCES spots(id) ON DELETE CASCADE);
 CREATE TABLE IF NOT EXISTS facility_types(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT UNIQUE NOT NULL);
 CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT,username TEXT UNIQUE NOT NULL,password TEXT NOT NULL,role TEXT NOT NULL);
 CREATE INDEX IF NOT EXISTS idx_spots_name ON spots(name);`);
 const count=await db.getFirstAsync<{n:number}>('SELECT COUNT(*) as n FROM spots');
 if(!count?.n){
  for(const c of ['Wisata Alam','Wisata Budaya','Wisata Edukasi','Wisata Rekreasi']) await db.runAsync('INSERT OR IGNORE INTO categories(name) VALUES (?)',c);
  for(const s of seeds){const r=await db.runAsync('INSERT INTO spots(name,category,address,description,ticketPrice,openingHours,latitude,longitude) VALUES (?,?,?,?,?,?,?,?)',s.name,s.category,s.address,s.description,s.ticketPrice,s.openingHours,s.latitude,s.longitude); for(const f of s.facilities) await db.runAsync('INSERT INTO facilities(spotId,type) VALUES (?,?)',r.lastInsertRowId,f);}
 }
 await db.runAsync("INSERT OR IGNORE INTO users(username,password,role) VALUES ('admin','admin123','Admin')");
 await db.runAsync("INSERT OR IGNORE INTO users(username,password,role) VALUES ('pengguna','pengguna123','Pengguna')");
 for(const f of FACILITIES) await db.runAsync('INSERT OR IGNORE INTO facility_types(name) VALUES (?)',f);
}
export async function login(username:string,password:string):Promise<'Admin'|'Pengguna'|null>{
 const user=await db.getFirstAsync<{role:'Admin'|'Pengguna'}>('SELECT role FROM users WHERE username=? AND password=?',[username.trim(),password]);
 return user?.role??null;
}
export async function getCategories():Promise<string[]>{const rows=await db.getAllAsync<{name:string}>('SELECT name FROM categories ORDER BY name');return rows.map(x=>x.name);}
export async function getFacilities():Promise<string[]>{const rows=await db.getAllAsync<{name:string}>('SELECT name FROM facility_types ORDER BY name');return rows.map(x=>x.name);}
export async function addCategory(name:string){const n=name.trim();if(!n) throw new Error('Nama kategori wajib diisi');await db.runAsync('INSERT INTO categories(name) VALUES (?)',n);}
export async function deleteCategory(name:string){const used=await db.getFirstAsync<{n:number}>('SELECT COUNT(*) n FROM spots WHERE category=?',name);if(used?.n) throw new Error('Kategori masih dipakai oleh objek wisata');await db.runAsync('DELETE FROM categories WHERE name=?',name);}
export async function addFacility(name:string){const n=name.trim();if(!n) throw new Error('Nama fasilitas wajib diisi');await db.runAsync('INSERT INTO facility_types(name) VALUES (?)',n);}
export async function deleteFacility(name:string){const used=await db.getFirstAsync<{n:number}>('SELECT COUNT(*) n FROM facilities WHERE type=?',name);if(used?.n) throw new Error('Fasilitas masih dipakai oleh objek wisata');await db.runAsync('DELETE FROM facility_types WHERE name=?',name);}
export async function getSpots():Promise<TouristSpot[]>{
 const rows=await db.getAllAsync<any>('SELECT * FROM spots ORDER BY name');
 const out:TouristSpot[]=[];
 for(const r of rows){const fs=await db.getAllAsync<{type:FacilityType}>('SELECT type FROM facilities WHERE spotId=?',[r.id]);out.push({...r,facilities:fs.map(x=>x.type)});}
 return out;
}
export async function saveSpot(s:Partial<TouristSpot> & {name:string;category:Category;address:string;description:string;openingHours:string;latitude:number;longitude:number}){
 let id=s.id;
 if(id) await db.runAsync('UPDATE spots SET name=?,category=?,address=?,description=?,ticketPrice=?,openingHours=?,latitude=?,longitude=? WHERE id=?',s.name,s.category,s.address,s.description,s.ticketPrice??0,s.openingHours,s.latitude,s.longitude,id);
 else {const r=await db.runAsync('INSERT INTO spots(name,category,address,description,ticketPrice,openingHours,latitude,longitude) VALUES (?,?,?,?,?,?,?,?)',s.name,s.category,s.address,s.description,s.ticketPrice??0,s.openingHours,s.latitude,s.longitude);id=Number(r.lastInsertRowId);}
 await db.runAsync('DELETE FROM facilities WHERE spotId=?',id!);for(const f of s.facilities??[]) await db.runAsync('INSERT INTO facilities(spotId,type) VALUES (?,?)',id!,f);
}
export async function deleteSpot(id:number){await db.runAsync('DELETE FROM facilities WHERE spotId=?',id);await db.runAsync('DELETE FROM spots WHERE id=?',id);}
export const CATEGORIES:Category[]=['Wisata Alam','Wisata Budaya','Wisata Edukasi','Wisata Rekreasi'];
export const FACILITIES:FacilityType[]=['Toilet','Tempat Parkir','Musala','Pusat Informasi','Tempat Makan'];
