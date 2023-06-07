-- create database mirandahoteldb;
use mirandahoteldb;

drop table if exists Bookings;
drop table if exists Rooms;
drop table if exists Contacts;
drop table if exists Users;

create table Rooms (
	room_id varchar(30) not null,
    room_type varchar(20) not null,
    room_number varchar(5) not null,
    price float not null,
    discount int,
    cancellation varchar(255),
    room_description varchar(255) not null,
    amenities JSON not null,
    photos JSON not null,
    available bool not null,
    primary key (room_id)
);

create table Bookings (
	booking_id varchar(30) not null,
    guest_name varchar(30) not null,
    guest_email varchar(30) not null,
    guest_contact varchar(15) not null,
    order_date datetime not null,
    check_in datetime not null,
    check_out datetime not null,
    special_request varchar(255),
    room varchar(30) not null,
    status varchar(15) not null,
    primary key (booking_id),
    foreign key (room) references Rooms(room_id)
    on update cascade
    on delete cascade
);

create table Users (
	user_id varchar(30) not null,
    photo varchar(100) not null,
    user_name varchar(30) not null,
    job varchar(30) not null,
    email varchar(30) not null,
    contact varchar(15) not null,
    start_date datetime not null,
    job_description varchar(255) not null,
    user_status varchar(15) not null,
    user_password varchar(255) not null,
    primary key (user_id)
);

create table Contacts (
	contact_id varchar(30) not null,
    contact_date datetime not null,
    guest_name varchar(30) not null,
    guest_email varchar(30) not null,
    guest_contact varchar(15) not null,
    content_title varchar(255) not null,
    content_text varchar(255) not null,
    primary key (contact_id)
);
