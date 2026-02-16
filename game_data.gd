extends Node

var player_hp = 100
var player_max_hp = 100
var player_atk = 10
var player_def = 0
var player_level = 1
var player_exp = 0
var exp_to_next = 100

var weapon_index = 0
var armor_index = 0

var weapons = [
	{"name": "木剑", "atk": 5, "color": Color("8B4513")},
	{"name": "铁剑", "atk": 12, "color": Color("A0A0A0")},
	{"name": "激光剑", "atk": 25, "color": Color("00FFFF")},
	{"name": "烈焰剑", "atk": 40, "color": Color("FF6600")}
]

var armors = [
	{"name": "布衣", "def": 2, "color": Color("D3D3D3")},
	{"name": "皮甲", "def": 8, "color": Color("8B4513")},
	{"name": "铁甲", "def": 18, "color": Color("606060")},
	{"name": "钻石甲", "def": 35, "color": Color("40E0D0")}
]

func get_total_atk():
	return player_atk + weapons[weapon_index]["atk"]

func get_total_def():
	return player_def + armors[armor_index]["def"]

func get_weapon_color():
	return weapons[weapon_index]["color"]

func get_armor_color():
	return armors[armor_index]["color"]

func get_weapon_name():
	return weapons[weapon_index]["name"]

func get_armor_name():
	return armors[armor_index]["name"]

func next_weapon():
	weapon_index = (weapon_index + 1) % weapons.size()

func next_armor():
	armor_index = (armor_index + 1) % armors.size()

func add_exp(amount):
	player_exp += amount
	while player_exp >= exp_to_next:
		player_exp -= exp_to_next
		level_up()

func level_up():
	player_level += 1
	exp_to_next = int(exp_to_next * 1.5)
	player_max_hp += 20
	player_hp = player_max_hp
	player_atk += 5
	player_def += 2

func heal(amount):
	player_hp = min(player_max_hp, player_hp + amount)

func take_damage(dmg):
	var actual = max(1, dmg - get_total_def())
	player_hp = max(0, player_hp - actual)
	return player_hp <= 0

func reset():
	player_hp = 100
	player_max_hp = 100
	player_atk = 10
	player_def = 0
	player_level = 1
	player_exp = 0
	exp_to_next = 100
	weapon_index = 0
	armor_index = 0
