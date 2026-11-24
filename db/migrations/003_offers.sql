-- Step 6: coaching offers live in the products table too, and every product picks its close.

alter table products drop constraint if exists products_kind_check;
alter table products add constraint products_kind_check check (kind in ('coaching', 'pdf', 'lesson'));

-- buy = price and checkout, contact = lead form, free = email for the download.
alter table products add column if not exists close text not null default 'contact';
alter table products drop constraint if exists products_close_check;
alter table products add constraint products_close_check check (close in ('buy', 'contact', 'free'));

-- Which form goal and testimonials the pages use (rehab, training, nutrition, fight-camp, group, other).
alter table products add column if not exists goal text not null default 'other';
-- Hero image for both pages, a path under /public or an https link.
alter table products add column if not exists image text;
-- Price terms shown under the price, e.g. "Monthly, 3-month minimum".
alter table products add column if not exists price_note text;
alter table products add column if not exists sort_order integer not null default 0;
