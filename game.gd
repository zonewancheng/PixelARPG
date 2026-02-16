extends Node2D

var enemy_scene = preload("res://enemy.tscn")
var item_scene = preload("res://item.tscn")

var wave = 1
var spawn_timer = 0.0
var boss_spawned = false
var game_over = false

func _ready():
	create_ground()
	spawn_enemies(4)
	spawn_items(6)

func _process(delta):
	if game_over:
		return
	
	spawn_timer += delta
	if spawn_timer > 4 and get_tree().get_nodes_in_group("enemy").size() < 3 + wave:
		spawn_timer = 0
		spawn_enemies(1)
	
	if not boss_spawned and wave >= 3 and get_tree().get_nodes_in_group("enemy").size() == 0:
		spawn_boss()
	
	update_ui()

func create_ground():
	var colors = [Color("2D5A27"), Color("3D6A37"), Color("2A4A1F")]
	for x in range(-20, 20):
		for y in range(-15, 15):
			var tile = ColorRect.new()
			tile.size = Vector2(32, 32)
			tile.position = Vector2(x * 32, y * 32)
			tile.color = colors[randi() % colors.size()]
			$Ground.add_child(tile)
	
	for i in range(50):
		var grass = ColorRect.new()
		grass.size = Vector2(8, 8)
		grass.color = Color("3D7A2A").lightened(randf() * 0.2)
		grass.position = Vector2(randf_range(-600, 600), randf_range(-450, 450))
		$Ground.add_child(grass)

func spawn_enemies(count):
	for i in range(count):
		var types = ["slime", "slime", "goblin"]
		if wave > 1:
			types.append("goblin")
		var etype = types[randi() % types.size()]
		spawn_enemy(etype)

func spawn_enemy(etype):
	var enemy = enemy_scene.instantiate()
	enemy.position = get_spawn_pos()
	enemy.setup(etype, wave)
	enemy.add_to_group("enemy")
	if has_node("Player"):
		enemy.target_node = $Player
	add_child(enemy)

func spawn_boss():
	boss_spawned = true
	var boss = enemy_scene.instantiate()
	boss.position = Vector2(350, 0)
	boss.setup("boss", wave)
	boss.add_to_group("enemy")
	boss.add_to_group("boss")
	if has_node("Player"):
		boss.target_node = $Player
	add_child(boss)
	$UI/BossPanel.visible = true
	$UI/BossPanel/BossHP.max_value = boss.hp
	$UI/BossPanel/BossHP.value = boss.hp

func spawn_items(count):
	var types = ["coin", "coin", "potion", "exp"]
	for i in range(count):
		var itype = types[randi() % types.size()]
		spawn_item(itype)

func spawn_item(itype):
	var item = item_scene.instantiate()
	item.position = get_spawn_pos()
	item.setup(itype)
	add_child(item)

func get_spawn_pos():
	var ppos = Vector2.ZERO
	if has_node("Player"):
		ppos = $Player.position
	while true:
		var pos = Vector2(randf_range(-400, 400), randf_range(-300, 300))
		if pos.distance_to(ppos) > 80:
			return pos
	return ppos + Vector2(150, 0)

func update_ui():
	var gd = GameData
	
	$UI/StatsPanel/Stats/Level.text = "等级: " + str(gd.player_level)
	$UI/StatsPanel/Stats/HP.text = "HP: %d/%d" % [gd.player_hp, gd.player_max_hp]
	$UI/StatsPanel/Stats/EXP.text = "经验: %d/%d" % [gd.player_exp, gd.exp_to_next]
	$UI/StatsPanel/Stats/Atk.text = "攻击: " + str(gd.get_total_atk())
	$UI/StatsPanel/Stats/Def.text = "防御: " + str(gd.get_total_def())
	$UI/StatsPanel/Stats/Weapon.text = "武器: " + gd.get_weapon_name()
	$UI/StatsPanel/Stats/Armor.text = "护甲: " + gd.get_armor_name()
	
	$UI/WavePanel/Wave/Label.text = "波次: " + str(wave)
	$UI/WavePanel/Wave/Enemies.text = "敌人: " + str(get_tree().get_nodes_in_group("enemy").size())
	
	if get_tree().get_nodes_in_group("boss").size() > 0:
		var boss = get_tree().get_nodes_in_group("boss")[0]
		$UI/BossPanel/BossHP.value = boss.hp
	else:
		$UI/BossPanel.visible = false
		if boss_spawned and wave < 5:
			wave += 1
			boss_spawned = false

func _on_enemy_died():
	pass
